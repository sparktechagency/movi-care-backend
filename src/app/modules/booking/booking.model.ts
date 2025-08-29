import mongoose, { Schema, model } from 'mongoose';
import { BookingModel, IBooking } from './booking.interface';
import { BookingStatus } from '../../../enums/booking';

const bookingSchema = new Schema<IBooking,BookingModel>({
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  pickup_location: {
    type: String,
    required: true
  },
  dropoff_location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(BookingStatus),
    default: BookingStatus.PENDING,
    required: true
  },
  payment_status: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid',
    required: true
  },
  base_fare: {
    type: Number,
    required: true
  },
  service_charge: {
    type: Number,
    required: true
  },
  additional_travelerse_fee: {
    type: Number,
    required: true
  },
  kids: {
    type: Number,
    default: 0
  },
  adults: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    required: true
  },
  formatted_date: {
    type: Date
  },
  payment_intent_id: {
    type: String
  },
  additional_info: {
    type: String
  },
  total_price: {
    type: Number
  },
  order_id: {
    type: String
  },
  distance: {
    type: Number
  },
  duration: {
    type: Number
  },
 pickup_time: {
    type: Date,
    required: true
  },
  dropoff_time: {
    type: Date,
    required: true
  },
  transaction_id: {
    type: String
  },
  refund_status:{
    type: String,
    enum:["pending","refunded"],
  }
  
}, { timestamps: true });

bookingSchema.index({pickup_time:1,dropoff_time:1})
const Booking = model<IBooking, BookingModel>('Booking', bookingSchema);

export default Booking;
