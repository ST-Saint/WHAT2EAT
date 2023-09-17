import { Restaurant } from '../interface/restaurant';

import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';
import { DishEntity } from './dish-entity';
import { Dish } from '../interface/dish';

@Entity({ name: 'restaurant' })
export class RestaurantEntity implements Restaurant {
    @PrimaryColumn({ type: 'text' })
    name: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
