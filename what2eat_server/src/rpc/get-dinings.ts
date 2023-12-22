import { DiningEntity } from '../entity/dining-entity';
import { ErrorResponse } from '../interface/response';
import { AppDataSource } from '../data-source';

let diningRepo = AppDataSource.getRepository(DiningEntity);

export const GetDinings = async (
    params: any,
    callback: (e: ErrorResponse | null, m?: string) => void,
) => {
    let dinings = await diningRepo.find();
    callback(null, JSON.stringify(dinings));
};
