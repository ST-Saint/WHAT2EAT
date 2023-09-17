import { Review } from '../interface/review';
import { ReviewEntity } from '../entity/review-entity';
import { ErrorResponse } from '../interface/response';
import { AppDataSource } from '../data-source';

let reviewRepo = AppDataSource.getRepository(ReviewEntity);

export const GetReviews = async (
    params: any,
    callback: (e: ErrorResponse | null, m?: string) => void,
) => {
    let reviews = await reviewRepo.find();
    callback(null, JSON.stringify(reviews));
};
