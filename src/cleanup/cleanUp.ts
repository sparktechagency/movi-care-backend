import cron from 'node-cron';
import Booking from '../app/modules/booking/booking.model';
import { BookingStatus } from '../enums/booking';
import { BookingService } from '../app/modules/booking/booking.service';
import { User } from '../app/modules/user/user.model';


async function bookingCleanup(){
    const now = new Date();


    const unpaidOrders = await Booking.deleteMany({
        status:"unpaid",
        createdAt:{
            $lt:new Date(new Date().getTime() - 24*60*60*1000)
        }
    })

    await User.deleteMany({
        verified:false,
    })


}

export const cleanup = () => {
  cron.schedule("0 0 * * *", async () => {
    await bookingCleanup();
    console.log("Expired subscriptions");
  }, {
    timezone: "America/New_York",
  });
};

