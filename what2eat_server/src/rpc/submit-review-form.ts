import { ErrorResponse } from '../interface/response';
import { ReviewEntity } from '../entity/review-entity';
import { DishReviewEntity } from '../entity/dish-review-entity';
import {
    DishReviewRepo,
    ReviewRepo,
} from '../data-source';

interface ReviewForm {
    dining: string;
    reviewer: string;
    restaurant: string;
    score: number;
    dishes: string[];
    scores: number[];
    dishComments: string[];
    comment: string;
    date: Date;
    uuid: string;
}

export const SubmitReviewForm = async (
    review: ReviewForm,
    callback: (e: ErrorResponse | null, m?: string) => void,
) => {
    console.log(review);

    let reviewEntity = new ReviewEntity();
    reviewEntity.reviewer = review.reviewer;
    reviewEntity.dining = review.dining;
    reviewEntity.restaurant = review.restaurant;
    reviewEntity.score = review.score;
    reviewEntity.comment = review.comment;

    let savedReview = await ReviewRepo.save(reviewEntity);
    console.log(savedReview);
    if (savedReview == null) {
        const error: ErrorResponse = new ErrorResponse(
            400,
            'Insert review failed',
        );
        callback(error);
    } else {
        review.dishes.forEach(async (value, index) => {
            if (value != '') {
                let dishReviewEntity = new DishReviewEntity();
                dishReviewEntity.review_id = savedReview.uuid;
                dishReviewEntity.dish = value;
                dishReviewEntity.score = review.scores[index];
                dishReviewEntity.comment = review.dishComments[index];
                DishReviewRepo.save(dishReviewEntity);
            }
        });
        callback(null, 'review form added');
    }

};
