import { DishEntity } from '../entity/dish-entity';
import { ErrorResponse } from '../interface/response';
import { AppDataSource } from '../data-source';

let dishRepo = AppDataSource.getRepository(DishEntity);

export const GetDishesByRestaurant = async (
    params: any,
    callback: (e: ErrorResponse | null, m?: string) => void,
) => {
    let dishes = await dishRepo.find({
        where: { restaurant: params.restaurant },
    });
    callback(null, JSON.stringify(dishes));
};
