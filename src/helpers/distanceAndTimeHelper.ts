import axios from "axios";
import config from "../config";
import { timeSlots } from "../shared/constrant";
import { toZonedTime } from 'date-fns-tz';
export async function getDistanceDuration(origin:string, destination:string) {
  const apiKey = config.google.apiKey
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    const res = await axios.get(url);
    const data = res.data;
    const element = data.rows[0].elements[0];
    const distance = element.distance.value && (element.distance.value/1000)
    const duration = element.duration.value && (element.duration.value/3600)

    console.log(`Distance: ${distance}, Duration: ${duration}`);
    return { distance, duration };
  } catch (error:any) {
    console.error("Error fetching distance:", error.message);
  }
}


const TIME_ZONE = 'UTC'; // You can make this dynamic if needed

export const makeDateFormat = (date: string, time: string) => {
  const dateTime = new Date(`${date} ${time}`); // Format: "YYYY-MM-DD HH:mm"
  const dateData=toZonedTime(dateTime, TIME_ZONE); // Converts to UTC
  
return dateTime;
};

export const approximateTime = (
  date: string,
  time: string,
  duration: number,
  bufferTime: number = 60
) => {
  console.log(time);
  
  const start = makeDateFormat(date, time);
  const end = new Date(start.getTime() + ((duration * 60*60) + bufferTime*60) * 1000)
  console.log(`Start: ${start.toLocaleTimeString()}, End: ${end.toLocaleTimeString()}`);
  
  let fixedEnd: Date | null = null;

  timeSlots.forEach((slotTime) => {
    const slotDate = makeDateFormat(date, slotTime);
    const diffInMinutes = Math.abs((slotDate.getTime() - end.getTime()) / 60000);
    
    if (diffInMinutes <= 15) {
      console.log(`Time matched with ${diffInMinutes} min difference`);
      console.log(`Slot Time: ${slotTime}`);
      
      fixedEnd = slotDate;
    }
  });

  return {
    start,
    end: fixedEnd,
  };
};





