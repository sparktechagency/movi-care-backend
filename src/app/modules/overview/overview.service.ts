import Booking from "../booking/booking.model";
import { User } from "../user/user.model";

const usersAndEarningsOverView = async (query:Record<string,any>)=>{
    const users = await User.countDocuments({verified:true});

    const booking = await Booking.countDocuments()

    const totalEarnigs = await Booking.aggregate([
        {
            $group:{
                _id:null,
                total:{$sum:"$total_price"}
            }
        }
    ])
    

    const totalEarnings = totalEarnigs[0]?.total

    const earningsYear = query?.earningsYear??new Date().getFullYear()
    const yearlyBooking = await Booking.aggregate([
        {
            $match:{
                createdAt:{
                    $gte:new Date(earningsYear,0,1),
                    $lte:new Date(earningsYear,11,31)
                }
            }
        },
        {
            $group:{
                _id:{$month:"$createdAt"},
                totalEarnigs :{$sum:"$total_price"}
            }
        }
    ])

    const months = {
        1:"Jan",
        2:"Feb",
        3:"Mar",
        4:"Apr",
        5:"May",
        6:"Jun",
        7:"Jul",
        8:"Aug",
        9:"Sep",
        10:"Oct",
        11:"Nov",
        12:"Dec"
    }

    let yearlyBookingData = []
    
    for(let i=1;i<=12;i++){
      const month = months[i as keyof typeof months]
        const totalEarnings = yearlyBooking.find(item=>item._id===i)?.totalEarnigs||0
        yearlyBookingData.push({
            month,
            totalEarnings
        })
    }

    const usersYear = query?.earningsYear??new Date().getFullYear()
    const yearlyUsers = await User.aggregate([
        {
            $match:{
                createdAt:{
                    $gte:new Date(earningsYear,0,1),
                    $lte:new Date(earningsYear,11,31)
                    }
                }
            },
            {
                $group:{
                    _id:{$month:"$createdAt"},
                    totalUsers :{$sum:1}
                }
            }
        ])
        let yearlyUsersData = []
        for(let i=1;i<=12;i++){
          const month = months[i as keyof typeof months]
            const totalUsers = yearlyUsers.find(item=>item._id===i)?.totalUsers||0
            yearlyUsersData.push({
                month,
                totalUsers
            })
        }

    return {
        users,
        booking,
        totalEarnings,
        yearlyBookingData,
        yearlyUsersData
    }
}

export const OverviewService = {
    usersAndEarningsOverView
}