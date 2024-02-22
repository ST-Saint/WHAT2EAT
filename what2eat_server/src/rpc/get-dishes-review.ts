import { DishReviewEntity } from '../entity/dish-review-entity';
import { ErrorResponse } from '../interface/response';
import { AppDataSource } from '../data-source';

let dishReviewRepo = AppDataSource.getRepository(
    DishReviewEntity,
);

export const GetDishesByReview = async (
    params: any,
    callback: (e: ErrorResponse | null, m?: string) => void,
) => {
    let dishes = await dishReviewRepo.find({
        where: { review_id: params.review_id },
    });
    callback(null, JSON.stringify(dishes));
};
