import {
    GetRestaurants,
    JRPCBody,
    JRPCRequest,
} from './RPC/JRPCRequest';
import { Config } from './config';
import { css } from '@emotion/css';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import {
    Controller,
    SubmitHandler,
    useForm,
} from 'react-hook-form';
import { v4 as UUID } from 'uuid';

interface IDish {
    dining: string;
    restaurant: string;
    name: string;
}

export class Dish implements IDish {
    dining: string;
    restaurant: string;
    name: string;

    constructor(
        dining: string,
        restaurant: string,
        name: string,
    ) {
        this.dining = dining;
        this.restaurant = restaurant;
        this.name = name;
    }
}

class DishForm {
    dining: string;
    dishes: string[];
    restaurant: string;

    constructor(dining: string, restaurant: string) {
        this.dining = dining;
        this.restaurant = restaurant;
        this.dishes = [''];
    }
}

const DishEditor = () => {
    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        getValues,
    } = useForm<DishForm>({
        defaultValues: { dishes: [''] },
    });

    // const jsDate: number = Date.now();

    // const [jsTimestamp, setTimestamp] =
    //     React.useState<Dayjs | null>(dayjs(jsDate));

    let [restaurants, setRestaurants] = useState([]);

    const onSubmit: SubmitHandler<DishForm> = async (
        dishForm,
    ) => {
        for (let dish of dishForm.dishes) {
            let addDishBody = JRPCBody(
                'add_dish',
                new Dish(
                    dishForm.dining,
                    dishForm.restaurant,
                    dish,
                ),
            );
            let response = await JRPCRequest(addDishBody);
        }
    };

    useEffect(() => {
        GetRestaurants((restaurants: any) => {
            setRestaurants(restaurants.reverse());
        });
    }, []);

    const handleInputChange = (
        index: number,
        value: string,
    ) => {
        let currentDishes = getValues('dishes');
        const updatedDishes = [...currentDishes];
        updatedDishes[index] = value;
        setValue('dishes', updatedDishes);

        if (
            index === updatedDishes.length - 1 &&
            value !== ''
        ) {
            updatedDishes.push('');
            setValue('dishes', updatedDishes);
        } else if (index === updatedDishes.length - 2) {
            while (
                index >= 0 &&
                updatedDishes[index] === ''
            ) {
                updatedDishes.splice(index, 1);
                --index;
            }
            setValue('dishes', updatedDishes);
        }
    };

    let dishes = watch('dishes', ['']);
    let dishFields = dishes.map((value, index) => (
        <TextField
            key={index}
            label={`Dish ${index + 1}`}
            value={value}
            onChange={(e) =>
                handleInputChange(index, e.target.value)
            }
        />
    ));
    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={css`
                    display: flex;
                    justify-content: center;
                    margin-top: 5em;
                `}
            >
                <Stack spacing={2} sx={{ width: 600 }}>
                    <h2>Dishes </h2>
                    <Controller
                        name='restaurant'
                        control={control}
                        rules={{ required: true }}
                        render={({
                            field: { onChange, value },
                        }) => (
                            <Autocomplete
                                freeSolo
                                onChange={(
                                    event,
                                    value,
                                ) => {
                                    onChange(value);
                                }}
                                onInputChange={(
                                    event,
                                    value,
                                ) => {
                                    onChange(value);
                                }}
                                options={restaurants.map(
                                    (restaurant: any) =>
                                        restaurant.name,
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label='Restaurant'
                                        InputProps={{
                                            ...params.InputProps,
                                            type: 'search',
                                        }}
                                    />
                                )}
                            />
                        )}
                    />
                    {dishFields}
                    <Button
                        type='submit'
                        variant='contained'
                    >
                        Submit
                    </Button>
                </Stack>
            </form>
        </>
    );
};
export default DishEditor;
