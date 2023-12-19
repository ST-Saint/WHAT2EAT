import * as jayson from 'jayson';
import { AppDataSource } from './data-source';
import * as cors from 'cors';
import * as connect from 'connect';
import { json as jsonParser } from 'body-parser';
import * as morgan from 'morgan';

import { Migrate } from './migrate';
import { AddDish, AddDishes } from './rpc/add-dish';
import { AddReview } from './rpc/add-review';
import { AddDining } from './rpc/add-dining';
import { GetDishes } from './rpc/get-dishes';
import { GetDinings } from './rpc/get-dinings';
import { GetReviews } from './rpc/get-reviews';
import { GetReviewers } from './rpc/get-reviewers';
import { GetRestaurants } from './rpc/get-restaurants';



async function main() {
    const app = connect();

    // create a server
    const server = new jayson.Server({
        add_dish: AddDish,
        add_dishes: AddDishes,
        add_review: AddReview,
        add_dining: AddDining,
        get_dishes: GetDishes,
        get_dining: GetDinings,
        get_reviews: GetReviews,
        get_reviewers: GetReviewers,
        get_restaurants: GetRestaurants,
    });

    await AppDataSource.initialize();

    // Migrate();

    app.use(morgan('combined'));
    app.use(cors({ methods: ['POST'] }));
    app.use(jsonParser());
    app.use(server.middleware());
    app.listen(5000);
}

main();
