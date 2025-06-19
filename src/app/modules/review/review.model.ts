import mongoose from "mongoose";
import { IReview, ReviewModel } from "./review.interface";

const reviewSchema = new mongoose.Schema<IReview,ReviewModel>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comment: {
        type: String,
    },
    rating: {
        type: Number,
        required: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
    }
},
{
    timestamps: true,
})

export const Review = mongoose.model<IReview, ReviewModel>('Review', reviewSchema);