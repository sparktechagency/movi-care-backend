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

    const bookingExist = await Booking.findOne({date:data.date,time:data.time,service:data.service,provider:data.provider,payment_status:"paid"})

    if(bookingExist){
        throw new ApiError(409,'This time slot is already booked')
    }

    data.formatted_date=formatted;
    const user = await User.findById(userData.id)
    if(!user){
        throw new ApiError(404,'user not found')
    }

    data.user = user._id as any

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
    const result = new QueryBuilder(Booking.find({user:id}),query).paginate().sort()
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
        select:"-password"
    }
]).lean()
return {data,getPaginationInfo}
}

const getAllBookings = async (query:Record<string,any>)=>{
    const result = new QueryBuilder(Booking.find(),query).sort()

    const data = await result.modelQuery.populate([
        {
            path:"service",
        },
        {
            path:"provider",
        },
        {
            path:"user",
            select:"-password"
        }
    ]).lean()

    const filterArray = data.filter((item:any)=>{
        const search = query.search.toLowerCase() as string

        return (
            !search ||
            item.user.name.toLowerCase().includes(search) ||
            item.provider.name.toLowerCase().includes(search) ||
            item.service.title.toLowerCase().includes(search) ||
            item.status.toLowerCase().includes(search) 
        ) && (
            !query.status ||
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

export const BookingService={
    bookServiceToDB,
    getAllBookingsByUser,
    getAllBookings,
    verifyOrder
}