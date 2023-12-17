import { DishEntity } from '../entity/dish-entity';
import { ErrorResponse } from '../interface/response';
import { AppDataSource } from '../data-source';

// let restaurantRepo = AppDataSource.getRepository(RestaurantEntity);
let dishRepo = AppDataSource.getRepository(DishEntity);

export const GetDishes = async (
    params: any,
    callback: (e: ErrorResponse | null, m?: string) => void,
) => {
    let dishes = await dishRepo.find({
        where: { restaurant: params.restaurant },
    });
    callback(null, JSON.stringify(dishes));
};
