import { INotification } from "../app/modules/notification/notification.interface";
import { Notification } from "../app/modules/notification/notification.model";
import { User } from "../app/modules/user/user.model";
import { USER_ROLES } from "../enums/user";

export const sendNotifications = async (data:INotification)=>{
try {
        const admins = (await User.find({role:{
        $in:[USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN]
    }})).map(user=>user._id)
    data.recivers = admins;
    const notification = await Notification.create(data)
    
    
    const io = (global as any).io


    for(let admin of admins){
        io.emit(`getNotifications::${admin}`,notification)
    }
    return notification
} catch (error) {
    console.log(error);
    
}
    
}