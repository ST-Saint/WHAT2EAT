import { Dish, Dining } from '../DishEditor';
import { Config } from '../config';
import { v4 as UUID } from 'uuid';

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
    try {
        let getReviewersBody = JRPCBody('get_restaurants');
        let response = await JRPCRequest(getReviewersBody);
        let restaurants: string[] = JSON.parse(
            response.result,
        );
        callback(restaurants);
        return restaurants;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const GetDinings = async (callback: Function) => {
    try {
        let getDiningBody = JRPCBody('get_dining');
        let response = await JRPCRequest(getDiningBody);
        let dining: Dining[] = JSON.parse(response.result);
        callback(dining);
        return dining;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const GetDishes = async (restaurant: string) => {
    try {
        let getReviewersBody = JRPCBody('get_dishes', {
            restaurant: restaurant,
        });
        let response = await JRPCRequest(getReviewersBody);
        let dishes: Dish[] = JSON.parse(response.result);
        return dishes;
    } catch (error) {
        console.log(error);
        return [];
    }
};
