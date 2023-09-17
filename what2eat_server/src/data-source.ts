import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { DishEntity } from './entity/dish-entity';
import { DiningEntity } from './entity/dining-entity';
import { ReviewEntity } from './entity/review-entity';
import { RestaurantEntity } from './entity/restaurant-entity';
import { ReviewerEntity } from './entity/reviewer-entity';

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'what2eat.sqlite',
    synchronize: true,
    logging: false,
    entities: [
        RestaurantEntity,
        ReviewEntity,
        ReviewerEntity,
        DishEntity,
        DiningEntity,
    ],
    migrations: [],
    subscribers: [],
});

export const ReviewRepo = AppDataSource.getRepository(ReviewEntity);
export const DishRepo = AppDataSource.getRepository(DishEntity);
export const RestaurantRepo = AppDataSource.getRepository(RestaurantEntity);
export const DiningRepo = AppDataSource.getRepository(DiningEntity);
