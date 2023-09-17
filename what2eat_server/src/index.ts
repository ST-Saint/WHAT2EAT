import * as jayson from 'jayson';
import { AppDataSource } from './data-source';
import * as cors from 'cors';
import * as connect from 'connect';
import { json as jsonParser } from 'body-parser';
import * as morgan from 'morgan';

import { Migrate } from './migrate';
import { AddReview } from './rpc/add-review';
import { GetReviews } from './rpc/get-reviews';
import { GetReviewers } from './rpc/get-reviewers';
import { GetRestaurants } from './rpc/get-restaurants';



async function main() {
    const app = connect();

    // create a server
    const server = new jayson.Server({
        add_review: AddReview,
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
