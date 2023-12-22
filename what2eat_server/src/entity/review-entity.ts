import { Review } from '../interface/review';
import { DiningEntity } from './dining-entity';
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

@Entity({ name: 'review' })
export class ReviewEntity implements Review {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: 'uuid' })
    @ManyToOne(() => DiningEntity, (dining: { uuid: string }) => dining.uuid)
    @JoinColumn([
        // { name: 'dish', referencedColumnName: 'name' },
        { name: 'dining', referencedColumnName: 'uuid' },
    ])
    dining: string;

    @Column({ type: 'varchar', length: 32 })
    reviewer: string;

    @Column({ type: 'text' })
    @ManyToOne(
        () => RestaurantEntity,
        (restaurant: { name: string }) => restaurant.name,
    )
    @JoinColumn([
        // { name: 'dish', referencedColumnName: 'name' },
        { name: 'restaurant', referencedColumnName: 'name' },
    ])
    restaurant: string;

    @Column({ type: 'text' })
    comment: string;

    @Column({ type: 'double' })
    score: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
