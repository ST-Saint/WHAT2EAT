import { DishReview } from '../interface/dish-review';
import { ReviewEntity } from './review-entity';
import { DishEntity } from './dish-entity';
import { RestaurantEntity } from './restaurant-entity';

import {
    Entity,
    PrimaryColumn,
    Column,
    JoinColumn,
    ManyToOne,
    ManyToMany,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'dish-review' })
export class DishReviewEntity implements DishReview {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: 'uuid' })
    @ManyToOne(
        () => ReviewEntity,
        (review: { uuid: string }) => review.uuid,
    )
    @JoinColumn([
        { name: 'review_id', referencedColumnName: 'uuid' },
    ])
    review_id: string;

    @Column({ type: 'text' })
    @ManyToMany(
        () => DishEntity,
        (dish: { name: string }) => dish.name,
    )
    @JoinColumn([
        { name: 'dish', referencedColumnName: 'name' },
        // { name: 'restaurant', referencedColumnName: 'restaurant' },
    ])
    dish: string;

    @Column({ type: 'double' })
    score: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
