import { JRPCBody, JRPCRequest } from './RPC/JRPCRequest';
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

interface Dish {
    dining: string;
    restaurant: string;
    name: string[];
}

class DishForm implements Dish {
    dining: string;
    restaurant: string;
    name: string[];

    constructor(uuid: string, restaurant: string) {
        this.dining = uuid;
        this.restaurant = restaurant;
        this.name = [];
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
        formState: { errors },
    } = useForm<DishForm>();

    // const jsDate: number = Date.now();

    // const [jsTimestamp, setTimestamp] =
    //     React.useState<Dayjs | null>(dayjs(jsDate));

    let [restaurants, setRestaurants] = useState([]);
    let dish_id = '';

    const onSubmit: SubmitHandler<DishForm> = async (
        dish,
    ) => {
        let getDishBody = JRPCBody('add_dish', dish);
        let response = await JRPCRequest(getDishBody);
        dish_id = JSON.parse(response.result);
    };

    useEffect(() => {
        getRestaurants();
    }, []);

    const getRestaurants = async () => {
        let jsonRPCBody: any = {
            jsonrpc: '2.0',
            method: 'get_restaurants',
            params: {},
            id: UUID(),
        };
        try {
            let resp = await fetch(Config.serverIP, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(jsonRPCBody),
                headers: {
                    'Content-Type':
                        'application/json; charset=UTF-8',
                },
            });
            setRestaurants(
                JSON.parse((await resp.json()).result),
            );
        } catch (error) {
            console.log(error);
        }
    };

    const [inputValues, setInputValues] = useState(['']); // 存储输入框的值的数组

    // 当输入框的值发生变化时，检查最后一个输入框是否有内容，如果有则新增一个输入框
    const handleInputChange = (
        index: number,
        value: string,
    ) => {
        const updatedValues = [...inputValues];
        updatedValues[index] = value;
        setInputValues(updatedValues);

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
                        name='dining'
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
                                        label='Dining record'
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
