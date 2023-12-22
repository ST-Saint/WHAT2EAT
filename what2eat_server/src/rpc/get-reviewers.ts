import { ReviewerEntity } from '../entity/reviewer-entity';
import { ErrorResponse } from '../interface/response';
import { AppDataSource } from '../data-source';

let reviewerRepo = AppDataSource.getRepository(ReviewerEntity);

export const GetReviewers = async (
    params: any,
    callback: (e: ErrorResponse | null, m?: string) => void,
) => {
    let reviewers = await reviewerRepo.find();
    callback(null, JSON.stringify(reviewers));
};
