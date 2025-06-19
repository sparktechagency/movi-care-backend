import { JwtPayload } from 'jsonwebtoken';
import QueryBuilder from '../../builder/QueryBuilder';
import { IReview } from './review.interface';
import { Review } from './review.model';
import { USER_ROLES } from '../../../enums/user';
import { User } from '../user/user.model';
import { sendNotifications } from '../../../helpers/notificationHelper';

const createReviewIntoDB = async (
  payload: IReview
): Promise<IReview | null> => {
  const result = await Review.create(payload);
  const userData = await User.findById(payload.user);
  await sendNotifications({
    text: `New review added by ${userData?.name}`,
    title: 'New Review',
    type: 'review',
    link: `${result._id}`,
    user: payload.user,
  });
  return result;
};

const getAllReviewsFromDB = async (
  query: Record<string, any>,
  user: JwtPayload
) => {
  const result = new QueryBuilder(
    Review.find(
      [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(user.role)
        ? {}
        : { user: user.id }
    ),
    query
  )
    .filter()
    .paginate()
    .sort();

  const paginationResult = await result.getPaginationInfo();
  const resultWithPagination = await result.modelQuery
    .populate(['booking','user']).lean().exec();

 
  return {
    data: resultWithPagination,
    pagination: paginationResult,
  };
};

const getFeaturesReviewsFromDB = async (): Promise<IReview[] | null> => {
  const result = await Review.find({ featured: true })
    .populate([
      {
        path: 'booking',
        select: 'service',
        populate: {
          path: 'service',
          select: 'name',
        },
      },
      {
        path: 'user',
        select: 'name image role email',
      },
    ])
    .lean();
  return result;
};

const deleteReviewFromDB = async (id: string): Promise<IReview | null> => {
  const result = await Review.findByIdAndDelete(id);
  return result;
};

const makeFeaturedReviewFromDB = async (
  id: string
): Promise<IReview | null> => {
  const review = await Review.findById(id);
  if (!review) {
    throw new Error('Review not found');
  }
  const result = await Review.findByIdAndUpdate(
    id,
    { featured: !review.featured },
    { new: true }
  );
  return result;
};

export default {
  createReviewIntoDB,
  getAllReviewsFromDB,
  getFeaturesReviewsFromDB,
  deleteReviewFromDB,
  makeFeaturedReviewFromDB,
};
