import { Dish } from '../interface/dish';
import { RestaurantEntity } from './restaurant-entity';

import {
    Entity,
    PrimaryColumn,
    Column,
    OneToMany,
    OneToOne,
    ManyToOne,
    ManyToMany,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';

@Entity({ name: 'dish' })
export class DishEntity implements Dish {
    @PrimaryColumn({ type: 'text' })
    @ManyToOne(
        () => RestaurantEntity,
        (restaurant: { name: string }) => restaurant.name,
    )
    @JoinColumn({ name: 'restaurant', referencedColumnName: 'name' })
    restaurant: string;

    @PrimaryColumn({ type: 'text' })
    name: string;

    @Column({ type: 'text', nullable: true })
    options: string | null;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
