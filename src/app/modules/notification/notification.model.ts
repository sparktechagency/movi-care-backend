import { model, Schema } from 'mongoose';
import { INotification, NotificationModel } from './notification.interface';

const notificationSchema = new Schema<INotification, NotificationModel>(
    {
        text: {
            type: String,
            required: true
        },
        read: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            enum: ['booking', 'message', 'review'],
            required: false,
        },

        link: {
            type: String,
            required: false,
        },
        title: {
            type: String,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        readers: {
            type: [Schema.Types.ObjectId],
            ref: 'User',
            required: false,
        },
        recivers: {
            type: [Schema.Types.ObjectId],
            ref: 'User',
            required: true,
        },
        

    },
    {
        timestamps: true
    }
);

export const Notification = model<INotification, NotificationModel>(
    'Notification',
    notificationSchema
);
