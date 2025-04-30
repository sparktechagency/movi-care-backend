import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../errors/ApiError";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { stripe } from "../../../helpers/stripeHelper";
import QueryBuilder from "../../builder/QueryBuilder";
import { Provider } from "../provider/provider.model";
import { Service } from "../services/service.model";
import { User } from "../user/user.model";
import { IBooking } from "./booking.interface";
import Booking from "./booking.model";
import { BookingStatus } from "../../../enums/booking";
import { USER_ROLES } from "../../../enums/user";
import { ObjectId } from "mongoose";

const bookServiceToDB = async (data:IBooking,userData:JwtPayload)=>{
    const service = await Service.findById(data.service)
    if(!service){
        throw new ApiError(404,'Invalid service')
    }
    const provider = await Provider.findById(data.provider)
    if(!provider){
        throw new ApiError(404,'Invalid provider')
    }

    const formatted = new Date(data.date+","+data.time).toISOString()

    if(new Date(formatted) < new Date()){
        throw new ApiError(403,"You can't book a past date")
    }
    
    const bookingExist = await Booking.findOne({date:data.date,time:data.time,service:data.service,provider:data.provider,payment_status:"paid",$or:[
        {status:BookingStatus.ACCEPT},
        {status:BookingStatus.PENDING}
    ]})

    if(bookingExist){
        throw new ApiError(409,'This time slot is already booked')
    }
data.formatted_date=formatted;

    const user = await User.findById(userData.id)
    if(!user){
        throw new ApiError(404,'user not found')
    }

    data.user = user._id as any
    const order_id = Math.floor(Math.random()*1000000).toString();
    data.order_id = order_id;

    const booking = await Booking.create(data)
    

    const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        line_items:[{price_data:{currency:'usd',product_data:{name:`${user.name}'s booking`},unit_amount:((data?.total_price||0)*100)},quantity:1}],
        mode:'payment',
        success_url:`http://localhost:${process.env.PORT}/api/v1/bookings/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:`http://localhost:${process.env.PORT}/api/v1/bookings/cancelled`,
        metadata:{data:JSON.stringify(booking._id)},
        customer_email:user.email,
    })

    return session.url
}

const getAllBookingsByUser = async(id:string,query:Record<string,any>)=>{
    const result = new QueryBuilder(Booking.find({user:id,payment_status:"paid"}),query).paginate().sort()
    const getPaginationInfo = await result.getPaginationInfo()
    const data = await result.modelQuery.populate([
        {
        path:"service",
    },
    {
        path:"provider",
    },
    {
        path:"user",
        select:"name email"
    }
]).lean()
return {data,getPaginationInfo}
}

const getAllBookings = async (query:Record<string,any>)=>{
    const result = new QueryBuilder(Booking.find({payment_status:"paid"}),query).sort()

    const data = await result.modelQuery.populate([
        {
            path:"service",
        },
        {
            path:"provider",
        },
        {
            path:"user",
            select:"name email"
        }
    ]).lean()

    const filterArray = data.filter((item:any)=>{
        const search = query?.searchTerm?.toLowerCase() as string

        return (
            !search ||
            item.user?.name?.toLowerCase().includes(search) ||
            item.provider?.name?.toLowerCase().includes(search) ||
            item.service?.name?.toLowerCase().includes(search) ||
            item.status.toLowerCase().includes(search)||
            item.order_id.includes(search) 
        ) && (
            !query?.status ||
            item.status === query.status
        )
    })

    const paginateInfoData = paginationHelper.paginateArray(filterArray,query)

    return {
        data:paginateInfoData.data,
        getPaginationInfo:paginateInfoData.pagination
    }

}

const verifyOrder = async (order_id:string,payment_id:string)=>{
    const booking = await Booking.findOneAndUpdate({_id:order_id},{payment_intent_id:payment_id,payment_status:"paid"})
    return booking
}

const changeStatus = async (id:string,status:BookingStatus,user:JwtPayload)=>{
    const booking = await Booking.findById(id)
    if(!booking){
        throw new ApiError(404,'Booking not found')
    }
    if((user.role==USER_ROLES.ADMIN||user.role==USER_ROLES.SUPER_ADMIN)&&[BookingStatus.CANCELLED,BookingStatus.COMPLETED].includes(status)){
        throw new ApiError(403,'Only pending bookings can be changed to other status and admin can only accept it')
    }
    if(user.role==USER_ROLES.USER&&![BookingStatus.CANCELLED,BookingStatus.COMPLETED].includes(status)){
        throw new ApiError(403,'Only cancelled or completed status can be changed by the user')
    }
    if(booking.status===BookingStatus.PENDING && status == BookingStatus.COMPLETED){
        throw new ApiError(403,'Completed status cannot be set before accepting the booking')
    }
    if(booking.status==BookingStatus.ACCEPT&&status==BookingStatus.CANCELLED){
        throw new ApiError(403,'Cancelled status cannot be set after accepting the booking')
    }
    if(booking.status==BookingStatus.COMPLETED){
        throw new ApiError(403,'Completed status cannot be changed')
    }
    if(status==BookingStatus.CANCELLED && ![BookingStatus.ACCEPT,BookingStatus.COMPLETED].includes(booking.status) && user.role==USER_ROLES.USER){
        const price = booking.total_price - booking.tax
        await stripe.refunds.create({
            payment_intent:booking.payment_intent_id,
            amount:(price*100),
          })
          const refund = await Booking.findByIdAndUpdate(id,{status:BookingStatus.CANCELLED},{new:true})
          return {
            message:"Refund successful",
            data:refund
          }
    }
   const updatedBooking = await Booking.findByIdAndUpdate(id,{status},{new:true})
    return {
        message:`Booking successfully ${status} `,
        data:updatedBooking
    }
}

const getSingleBooking = async (id:ObjectId)=>{
    const booking = await Booking.findById(id).populate([{
        path:"service",
    },
    {
        path:"provider",
    },
    {
        path:"user",
        select:"name email"
    
    }])
    
    return booking
}

const getBookeSlotByMonth = async(month:string)=>{
    const bookings = await Booking.find({$or:[
        {status:BookingStatus.ACCEPT},
        {status:BookingStatus.PENDING}
    ],
    formatted_date:{$regex:month,$options:'i'},
    payment_status:"paid"
})
    const filterData = bookings.map(item=>{
        return {
            date:parseInt(item.formatted_date?.split('T')[0].split('-')[2]!),
            time:item.formatted_date?.split('T')[1],
        }
    })
    
    
   return filterData.sort((a,b)=>{
       return a.date-b.date
    })
    
    
}

export const BookingService={
    bookServiceToDB,
    getAllBookingsByUser,
    getAllBookings,
    verifyOrder,
    changeStatus,
    getSingleBooking,
    getBookeSlotByMonth
}