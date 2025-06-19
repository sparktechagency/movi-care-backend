import { JwtPayload } from 'jsonwebtoken';
import { INotification } from './notification.interface';
import { Notification } from './notification.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { Types } from 'mongoose';


const createNotification = async (payload: INotification): Promise<INotification | null> => {
    const result = await Notification.create(payload);
    return result;
};

const getAllNotifications = async (user: JwtPayload,query:Record<string,any>) => {
    const result = new QueryBuilder(Notification.find({
        recivers:{
            $in:[new Types.ObjectId(user.id)]
        }
    }),query).sort().paginate()
    const paginationInfo = await result.getPaginationInfo()
    const data = await result.modelQuery.populate('user','name email').lean().exec()
    return {
      data:data.map((item:any)=>(
        {
            ...item,
            read:item.readers.includes(new Types.ObjectId(user.id))
        }
      )),
        paginationInfo
    }
};

const readSingleNotification = async (user: JwtPayload, id: string): Promise<INotification | null> => {
    const result = await Notification.findOneAndUpdate({ _id: id, readers:{$nin:[new Types.ObjectId(user.id)]},recivers:{
        $in:[new Types.ObjectId(user.id)]
    }}, {$push:{
        readers:user.id
    }}, { new: true });
    return result;
};

const readAllNotifications = async (user: JwtPayload) => {
    const result = await Notification.updateMany({recivers:{
        $in:[new Types.ObjectId(user.id)]
    }}, {$push:{
        readers:user.id
    }});
    return result;
};

export const NotificationService = {
    createNotification,
    getAllNotifications,
    readSingleNotification,
    readAllNotifications
};