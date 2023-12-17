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
    } = useForm<DishForm>();

    // const jsDate: number = Date.now();

    // const [jsTimestamp, setTimestamp] =
    //     React.useState<Dayjs | null>(dayjs(jsDate));

    let [restaurants, setRestaurants] = useState([]);

    const onSubmit: SubmitHandler<DishForm> = async (
        dishForm,
    ) => {
        console.log(dishForm);
        for (let dish of dishForm.dishes) {
            let addDishBody = JRPCBody(
                'add_dish',
                new Dish(
                    dishForm.dining,
                    dishForm.restaurant,
                    dish,
                ),
            );
            console.log(addDishBody);
            let response = await JRPCRequest(addDishBody);
            console.log(response);
        }
    };

    useEffect(() => {
        GetRestaurants((restaurants: any) => {
            setRestaurants(restaurants.reverse());
        });
    }, []);

    const [inputValues, setInputValues] = useState(['']); // 存储输入框的值的数组

    // 当输入框的值发生变化时，检查最后一个输入框是否有内容，如果有则新增一个输入框
    const handleInputChange = (
        index: number,
        value: string,
    ) => {
        const updatedValues = [...inputValues];
        updatedValues[index] = value;
        setInputValues(updatedValues);
        setValue('dishes', updatedValues);

        // 检查最后一个输入框是否有内容，如果有则新增一个空白输入框
        if (
            index === inputValues.length - 1 &&
            value !== ''
        ) {
            updatedValues.push('');
            setInputValues(updatedValues);
        } else if (index === inputValues.length - 2) {
            while (
                index >= 0 &&
                updatedValues[index] === ''
            ) {
                updatedValues.splice(index, 1);
                --index;
            }
            setInputValues(updatedValues);
        }
    };

    // 渲染所有输入框
    const inputFields = inputValues.map((value, index) => (
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
                    {inputFields}
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
