import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { stripe } from '../../../helpers/stripeHelper';
import QueryBuilder from '../../builder/QueryBuilder';
import { Provider } from '../provider/provider.model';
import { Service } from '../services/service.model';
import { User } from '../user/user.model';
import { IBooking } from './booking.interface';
import Booking from './booking.model';
import { BookingStatus } from '../../../enums/booking';
import { USER_ROLES } from '../../../enums/user';
import { ObjectId } from 'mongoose';
import { sendNotifications } from '../../../helpers/notificationHelper';
import { date } from 'zod';
import { calulatePrice } from '../../../helpers/priceCalculator';
import {
  approximateTime,
  getDistanceDuration,
  makeDateFormat,
} from '../../../helpers/distanceAndTimeHelper';
import { timeSlots } from '../../../shared/constrant';
import crypto from 'crypto';
import config from '../../../config';
const bookServiceToDB = async (data: IBooking, userData: JwtPayload) => {
  const service = await Service.findById(data.service);
  if (!service) {
    throw new ApiError(404, 'Invalid service');
  }
  const provider = await Provider.findById(data.provider);
  if (!provider) {
    throw new ApiError(404, 'Invalid provider');
  }
  const data2 = await getDistanceDuration(
    data.pickup_location,
    data.dropoff_location
  );

  if (!data2?.distance || !data2?.duration) {
    throw new ApiError(404, 'Invalid location');
  }

  const formatted = new Date(data.date);

  if (new Date(formatted) < new Date()) {
    throw new ApiError(403, "You can't book a past date");
  }
  const time = approximateTime(
    data.date as any,
    data.pickup_time as any,
    data2?.duration
  );

  if (!time.start || !time.end) {
    throw new ApiError(
      403,
      'This time slot is not available please select another time slot'
    );
  }

  data.pickup_time = time.start;
  data.dropoff_time = time.end as any;

  const bookingExist = await Booking.findOne({
    payment_status: 'paid',
    $or: [
      { status: BookingStatus.CONFIRMED },
      { status: BookingStatus.PENDING },
    ],
    pickup_time: { $gte: data.pickup_time, $lte: data.dropoff_time },
    dropoff_time: { $gte: data.pickup_time, $lte: data.dropoff_time },
  });

  
  

  if (bookingExist) {
    throw new ApiError(
      409,
      'This time slot is not available please select another time slot'
    );
  }
  data.formatted_date = formatted as any;

  const user = await User.findById(userData.id);
  if (!user) {
    throw new ApiError(404, 'user not found');
  }

  data.user = user._id as any;
  const order_id = Math.floor(Math.random() * 1000000).toString();
  data.order_id = order_id;
  const passengers = data.adults + data.kids;
  const priceData = calulatePrice({
    serviceFee: service.service_price!,
    distanceKm: data2.distance!,
    durationHours: data2.duration,
    fixedProcessingFee: service.fixed_price || 0,
    passengers: passengers,
    ratePerExtraPerson: provider.price,
    ratePerHour: service.price_per_hour || 0,
    ratePerKm: service.price_per_km || 0,
    taxRate: service.taxs || 0,
  });
  data.total_price = priceData.total;

  const booking = await Booking.create(data);

  const price = Math.round((data?.total_price || 0) * 100);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: `${user.name}'s booking` },
          unit_amount: price+1,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${config.url.frontend_url}/current-booking`,
    cancel_url: `${config.url.frontend_url}`,
    metadata: { data: JSON.stringify(booking._id) },
    customer_email: user.email,
  });

  return session.url;
};

const getAllBookingsByUser = async (id: string, query: Record<string, any>) => {
  const result = new QueryBuilder(
    Booking.find({ user: id, payment_status: 'paid' }),
    query
  )
    .paginate()
    .sort();
  const getPaginationInfo = await result.getPaginationInfo();
  const data = await result.modelQuery
    .populate([
      {
        path: 'service',
      },
      {
        path: 'provider',
      },
      {
        path: 'user',
        select: 'name email',
      },
    ])
    .lean();
  return { data, getPaginationInfo };
};

const getAllBookings = async (query: Record<string, any>, user: JwtPayload) => {
  const currentDate = new Date();
  const result = new QueryBuilder(
    Booking.find(
      [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(user.role)
        ? { payment_status: 'paid' }
        : query?.durationType == 'current'
        ? { user: user.id, payment_status: 'paid', date: { $gte: currentDate } }
        : { user: user.id, payment_status: 'paid', date: { $lt: currentDate } }
    ),
    {}
  ).sort();

  const data = await result.modelQuery
    .populate([
      {
        path: 'service',
      },
      {
        path: 'provider',
      },
      {
        path: 'user',
        select: 'name email',
      },
    ])
    .lean();

  const filterArray = data.filter((item: any) => {
    const search = query?.searchTerm?.toLowerCase() as string;

    return (
      (!search ||
        item.user?.name?.toLowerCase().includes(search) ||
        item.provider?.name?.toLowerCase().includes(search) ||
        item.service?.name?.toLowerCase().includes(search) ||
        item.status.toLowerCase().includes(search) ||
        item.order_id.includes(search)) &&
      (!query?.status || item.status === query.status)
    );
  });

  const paginateInfoData = paginationHelper.paginateArray(filterArray, query);

  return {
    data: paginateInfoData.data,
    getPaginationInfo: paginateInfoData.pagination,
  };
};

const verifyOrder = async (order_id: any, payment_id: string) => {
  try {
      const booking: any = await Booking.findOneAndUpdate(
    { _id: order_id },
    { payment_intent_id: payment_id, payment_status: 'paid' },
    { new: true }
  ).populate('user', 'name');

  await sendNotifications({
    title: 'New Booking Come',
    text: `New booking come from ${booking.user.name}`,
    type: 'booking',
    link: booking?._id as string,
    user: booking?.user._id as any,
  });
  return booking;

  } catch (error) {
    return console.log(error);
  }
}

const changeStatus = async (
  id: string,
  status: BookingStatus,
  user: JwtPayload
) => {
  const booking = await Booking.findById(id);
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }
  const userData = await User.findById(user.id);

  if (
    user.role == USER_ROLES.USER &&
    [BookingStatus.CONFIRMED].includes(status)
  ) {
    throw new ApiError(403, 'You are not authorized to change this status');
  }

  if (booking.status == BookingStatus.CANCELLED) {
    throw new ApiError(403, 'Booking is already cancelled');
  }
  if (status == BookingStatus.CANCELLED && user.role !== USER_ROLES.USER) {
    const price = booking.total_price;
    await stripe.refunds.create({
      payment_intent: booking.payment_intent_id,
      amount: price * 100,
    });
    const refund = await Booking.findByIdAndUpdate(
      id,
      { status: BookingStatus.CANCELLED },
      { new: true }
    );
    return {
      message: 'Refund successful',
      data: refund,
    };
  }
  if (status == BookingStatus.CANCELLED && user.role == USER_ROLES.USER) {
    const currentDate: any = new Date();

    const bookingDate: any = new Date(booking.date!);
    const diff = bookingDate - currentDate;
    const diffInHouurs = diff / (1000 * 60 * 60);

    if (diffInHouurs < 48) {
      throw new ApiError(
        403,
        'You cannot cancel the booking within 48 hours of booking'
      );
    }

    const price = booking.total_price;
    try {
      await stripe.refunds.create({
        payment_intent: booking.payment_intent_id,
        amount: price * 100,
      });
    } catch (error) {
      throw new ApiError(403, 'Already refunded');
    }
    const refund = await Booking.findByIdAndUpdate(
      id,
      { status: BookingStatus.CANCELLED },
      { new: true }
    );
    await sendNotifications({
      title: 'Booking Cancelled',
      text: `booking has been cancelled by ${userData?.name}`,
      type: 'booking',
      link: booking?._id as any as string,
      user: (booking as any)?.user.id as any,
    });
  }
  const TranscationId =
    'TRX' + crypto.randomBytes(6).toString('hex').toUpperCase();

  const updatedBooking = await Booking.findByIdAndUpdate(
    id,
    { status, transaction_id: TranscationId },
    { new: true }
  );
  return {
    message: `Booking successfully ${status} `,
    data: updatedBooking,
  };
};

const getSingleBooking = async (id: ObjectId) => {
  const booking = await Booking.findById(id).populate([
    {
      path: 'service',
    },
    {
      path: 'provider',
    },
    {
      path: 'user',
      select: 'name email',
    },
  ]);

  return booking;
};

const getBookeSlotByMonth = async (month: string) => {
  const currentMonthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth()
  );

  const bookings = (
    await Booking.find(
      {
        $or: [
          { status: BookingStatus.CONFIRMED },
          { status: BookingStatus.PENDING },
        ],
        date: { $gte: currentMonthStart },
        payment_status: 'paid',
      },
      { date: 1 }
    ).sort({ date: 1 })
  ).map(item => item.date.toISOString().split('T')[0]);
  const uniqueDates = [...new Set(bookings)];
  let fullDate: string[] = [];
  for (let date of uniqueDates) {
    const dateObj = (await getDateTimeSlots(date)).filter(
      item => !item.available
    );
    if (dateObj.length == timeSlots.length) {
      fullDate.push(date);
    }
  }
  return fullDate;
};

const rebookOrderIntoDB = async (id: string, payload: Partial<IBooking>) => {
  if (new Date(payload.date!) < new Date()) {
    throw new ApiError(403, "You can't book a past date");
  }
  const booking = await Booking.findById(id).lean();
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  const user = await User.findById(booking.user);

  booking.status = BookingStatus.PENDING;
  booking.payment_status = 'unpaid';
  booking.payment_intent_id = '';
  booking.order_id = Math.floor(Math.random() * 1000000).toString();
  booking.date = payload.date!;
  booking.pickup_time = payload.pickup_time!;

  delete booking.createdAt;
  delete booking.updatedAt;

  const newObject: any = { ...booking };
  delete newObject._id;

  return await bookServiceToDB(newObject, {
    id: user?._id as any,
    email: user?.email as string,
    role: user?.role as string,
  });
};

const getDateTimeSlots = async (date: string) => {
  const currentDate = new Date(date);

  const currentDatePlusOne = new Date(
    currentDate.setDate(currentDate.getDate() + 1)
  );

  const bookings = await Booking.find(
    {
      date: {
        $gte: currentDate.setDate(currentDate.getDate() - 1),
        $lt: currentDatePlusOne,
      },
      payment_status: 'paid',
      status: {
        $in: [BookingStatus.CONFIRMED, BookingStatus.PENDING],
      },
    },
    { date: 1, pickup_time: 1, dropoff_time: 1 }
  )
    .lean()
    .exec();

  let timeSlotsData = timeSlots.map(item => ({
    time: makeDateFormat(date, item),
    available: true,
  }));

  bookings.forEach(item => {
    const startTime = item.pickup_time;
    const endTime = item.dropoff_time;

    timeSlotsData = timeSlotsData.map((item, index) => {
      if (item.time >= startTime && item.time <= endTime) {
        item.available = false;
      }
      return {
        time: item.time,
        available: item.available,
      };
    });
  });
  return timeSlotsData.map((item, index) => ({
    time: timeSlots[index],
    available: item.available,
  }));
};

const bookingTransactions = async (query: Record<string, any>) => {
  const currentDate = new Date();
  const result = new QueryBuilder(
    Booking.find({
      date: {
        $lt: currentDate,
      },
      payment_status: 'paid',
      status: {
        $in: [BookingStatus.CONFIRMED],
      },
    }),
    {}
  ).sort();
  const bookings = await result.modelQuery
    .populate([
      {
        path: 'service',
        select: 'name',
      },
      {
        path: 'provider',
        select: 'name',
      },
      {
        path: 'user',
        select: 'name email',
      },
    ])
    .lean();

  const filterData = bookings.filter((item: any) => {
    if (!query.searchTerm) {
      return true;
    }

    const search = query.searchTerm.toLowerCase();

    return (
      item.user.name.toLowerCase().includes(search) ||
      item.user.email.toLowerCase().includes(search) ||
      item.service.name.toLowerCase().includes(search) ||
      item.provider.name.toLowerCase().includes(search) ||
      item.transaction_id.toLowerCase().includes(search)
    );
  });

  const pagination = paginationHelper.paginateArray(filterData, query);

  return {
    data: pagination.data,
    paginationInfo: pagination.pagination,
  };
};

// timeSLotChecker

const timeSLotChecker = async (data: {
  date: string;
  pickup_time: string;
  pickup_location: string;
  dropoff_location: string;
}) => {
  const data2 = await getDistanceDuration(
    data.pickup_location,
    data.dropoff_location
  );

  if (!data2?.distance || !data2?.duration) {
    
    throw new ApiError(404, 'Invalid location');
  }


  const time:any = approximateTime(
    data.date as any,
    data.pickup_time as any,
    data2?.duration
  );

  if (!time.start || !time.end) {
    throw new ApiError(
      403,
      'This time slot is not available please select another time slot'
    );
  }



  const bookingExist = await Booking.findOne({
    payment_status: 'paid',
    $or: [
      { status: BookingStatus.CONFIRMED },
      { status: BookingStatus.PENDING },
    ],
    pickup_time: { $gte: time.start, $lte: time.end },
    dropoff_time: { $gte: time.start, $lte: time.end },
  });

  if (bookingExist) {
    throw new ApiError(
      409,
      'This time slot is not available please select another time slot'
    );
  }




  return {
    time: time.start,
    end: time.end,
  };
};

function toStandardTime(time24:string) {
  const [hour, minute] = time24.split(":").map(Number);
  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minute);
  
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export const BookingService = {
  bookServiceToDB,
  getAllBookingsByUser,
  getAllBookings,
  verifyOrder,
  changeStatus,
  getSingleBooking,
  getBookeSlotByMonth,
  rebookOrderIntoDB,
  getDateTimeSlots,
  bookingTransactions,
  timeSLotChecker,
};
