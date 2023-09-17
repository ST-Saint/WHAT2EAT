import { RestaurantEntity } from '../entity/restaurant-entity';
import { ErrorResponse } from '../interface/response';
import { AppDataSource } from '../data-source';

let restaurantRepo = AppDataSource.getRepository(RestaurantEntity);

export const GetRestaurants = async (
    params: any,
    callback: (e: ErrorResponse | null, m?: string) => void,
) => {
    let restaurants = await restaurantRepo.find();
    callback(null, JSON.stringify(restaurants));
};
