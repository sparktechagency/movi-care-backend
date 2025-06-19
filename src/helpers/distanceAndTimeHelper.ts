import axios from "axios";
import config from "../config";
import { timeSlots } from "../shared/constrant";

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

export const makeDateFormat = (date:string,time:string)=>{

  

 const start = new Date(`${date} ${time}`);
 
  return start;
}


export const approximateTime = (date: string, time: string, duration: number, bufferTime: number = 60) => {
  // Parse time parts
 const start = makeDateFormat(date,time)

  const end = new Date(start.getTime() + (duration * 60 + bufferTime) * 60000);

  let fixedEnd = null

  timeSlots.forEach((slot) => {
    const slotDate = makeDateFormat(date,slot)
    const diffInMinutes = Math.abs((slotDate.getTime() - end.getTime()) / (1000 * 60));
    if (diffInMinutes <= 15) {
      console.log(diffInMinutes);
      
      fixedEnd = slotDate;
    }
    
  
})

console.log(duration);


console.log(fixedEnd);

return{
  start,
  end:fixedEnd
}

}




