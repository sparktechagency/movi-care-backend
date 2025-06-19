import { Model, Types } from "mongoose";

export type IReview = {
  user:Types.ObjectId;
  comment?: string;
  rating: number;
  featured ?: boolean;
  booking?:Types.ObjectId;
}
export type ReviewModel = Model<IReview, Record<string, unknown>>;