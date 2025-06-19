import { Model, Types } from 'mongoose';

export type INotification = {
    text: string;
    title: string;
    read?: boolean;
    type:"booking"|"message"|"review",
    link:string,
    user:Types.ObjectId,
    recivers?:Types.ObjectId[],
    readers?:Types.ObjectId[],
};

export type NotificationModel = Model<INotification>;