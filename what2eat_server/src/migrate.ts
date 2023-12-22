import { AppDataSource } from './data-source';
import { ReviewEntity } from './entity/review-entity';
import { ReviewerEntity } from './entity/reviewer-entity';
import { RestaurantEntity } from './entity/restaurant-entity';
import { SHA1 } from 'crypto-js';
import { v4 as UUID } from 'uuid';
import * as fs from 'fs';
import { DishEntity } from './entity/dish-entity';
import { DiningEntity } from './entity/dining-entity';

function tryInsertReview(record: ReviewEntity) {
    console.log(record);
    AppDataSource.manager.save(record);
}

export const Migrate = async () => {
    // const dishes = await AppDataSource.manager.find(RestaurantEntity);
    // console.log(dishes);
    // let di = new DishEntity();
    // di.name = 'dish';
    // di.restaurant = 'restaurant';
    // let rest: RestaurantEntity = new RestaurantEntity();
    // rest.name = "restaurant";
    // await AppDataSource.manager.save(rest);
    // await AppDataSource.manager.save(di);
    // await AppDataSource.manager.save(di);

    fs.readFile(
        '/home/yayu/Project/WHAT2EAT/what2eat_webapp/what2eat_server/data/reviews.json',
        'utf-8',
        async (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const reviews = JSON.parse(data).data;
            for (let ele of reviews) {
                var review = new ReviewEntity();
                var restaurant = new RestaurantEntity();
                var dish = new DishEntity();
                var dining = new DiningEntity();
                restaurant.name = ele[0];

                dish.restaurant = ele[0];
                dish.name = ele[2];

                review.restaurant = ele[0];
                review.reviewer = ele[1];
                review.dish = ele[2];

                review.score = Number(ele[3]);
                review.comment = ele[4];
                // review.unix_timestamp = Math.floor(
                //     new Date(ele[5]).getTime() / 1000,
                // );
                // review.uuid = ele[6];

                // dining.uuid = UUID();
                dining.restaurant = restaurant.name;
                dining.unixTimestamp =
                    Math.floor(
                        Math.floor(
                            Math.floor(
                                Math.floor(new Date(ele[5]).getTime() / 1000) /
                                    24,
                            ) / 60,
                        ) / 60,
                    ) *
                    24 *
                    60 *
                    60;

                await AppDataSource.manager.save(restaurant);

                let reviewer: ReviewerEntity = new ReviewerEntity();
                reviewer.name = review.reviewer;

                await AppDataSource.manager.save(reviewer);

                let query0 = await AppDataSource.manager.findBy(
                    DiningEntity,
                    dining,
                );
                if (query0.length == 0) {
                    dining = await AppDataSource.manager.save(dining);
                    review.dining = dining.uuid;
                } else {
                    review.dining = query0[query0.length - 1].uuid;
                }

                let query = await AppDataSource.manager.findBy(
                    DishEntity,
                    dish,
                );

                if (query.length == 0 && dish.name != null) {
                    await AppDataSource.manager.save(dish);
                }

                if (ele[2] != null && ele[2].startsWith('[')) {
                    let dishes = ele[2].substr(1, ele[2].length - 2).split(',');

                    console.log(dishes);
                    // review.dish = dishes;
                    // tryInsertReview(review);
                    // for (let dish of dishes) {
                    //     review.dish = dish;
                    //     tryInsertReview(review);
                    // }
                } else {
                    tryInsertReview(review);
                }
            }
        },
    );

    // console.log('Inserting a new user into the database...');
    // const rest = new RestaurantEntity();
    // rest.name = 'restaurant';
    // await AppDataSource.manager.save(rest);
    // const dish = new DishEntity()
    // dish.name ="abc";
    // dish.restaurant = "restaurant";
    // await AppDataSource.manager.save(dish);

    // const user = new User();
    // const review = new ReviewEntity();
    // review.reviewer = '07';
    // review.uuid = UUID();
    // review.score = 91.1;
    // review.dish = null;
    // review.comment = 'comment';
    // review.restaurant = 'restaurant';
    // review.timestamp = new Date().getTime();
    // console.log('time ', review.timestamp);
    // // user.firstName = "Timber"
    // // user.lastName = "Saw"
    // // user.age = 25

    // await AppDataSource.manager.save(review);
    // console.log('Saved a new review with id: ' + review.uuid);

    // console.log('Loading reviews from the database...');
    // const reviews = await AppDataSource.manager.find(ReviewEntity);
    // console.log('Loaded reviews: ', reviews);

    // // AppDataSource.manager.findBy();

    // const stReviews = await AppDataSource.manager.findBy(ReviewEntity, {
    //     reviewer: '07',
    // });

    // console.log('Loaded st reviews: ', stReviews);

    // console.log(
    //     'Here you can setup and run express / fastify / any other framework.',
    // );
};
