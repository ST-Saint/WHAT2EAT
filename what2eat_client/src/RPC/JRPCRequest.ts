import { Config } from '../config';
import { v4 as UUID } from 'uuid';
import {Dish} from "../DishEditor";

export const JRPCBody = (method: string, params?: any) => {
    return {
        jsonrpc: '2.0',
        method: method,
        params: params ? params : {},
        id: UUID(),
    };
};

export const JRPCRequest = async (jsonRPCBody: any) => {
    let response = await fetch(Config.serverIP, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(jsonRPCBody),
        headers: {
            'Content-Type':
                'application/json; charset=UTF-8',
        },
    });
    return await response.json();
};

export const GetRestaurants = async (
    callback: Function,
) => {
    let getReviewersBody = JRPCBody('get_restaurants');
    let response = await JRPCRequest(getReviewersBody);
    let restaurants: string[] = JSON.parse(response.result);
    callback(restaurants);
    return restaurants;
};

export const GetDishes = async (restaurant: string) => {
    let getReviewersBody = JRPCBody('get_dishes', {
        restaurant: restaurant,
    });
    let response = await JRPCRequest(getReviewersBody);
    let dishes: Dish[] = JSON.parse(response.result);
    return dishes;
};
