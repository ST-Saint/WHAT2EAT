import {
    JRPCBody,
    JRPCRequest,
    GetRestaurants,
    GetDishesByRestaurant,
} from './RPC/JRPCRequest';
import { Config } from './config';
import { DiningProps } from './props';
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

interface Dining {
    uuid: string;
    unixTimestamp: number;
    restaurant: string;
    people: number;
    price: number;
}

class DiningForm implements Dining {
    uuid: string;
    unixTimestamp: number;
    restaurant: string;
    people: number;
    price: number;

    constructor(
        uuid: string,
        unixTimestamp: number,
        restaurant: string,
        people: number,
        price: number
    ) {
        this.uuid = uuid;
        this.unixTimestamp = unixTimestamp;
        this.restaurant = restaurant;
        this.people = people;
        this.price = price;
    }
}

const DiningEditor = ({ setDining }: DiningProps) => {
    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<DiningForm>();

    // const jsDate: number = Date.now();

    // const [jsTimestamp, setTimestamp] =
    //     React.useState<Dayjs | null>(dayjs(jsDate));

    let [restaurants, setRestaurants] = useState([]);
    let dining_id = '';

    const onSubmit: SubmitHandler<DiningForm> = async (
        dining,
    ) => {
        let getDiningBody = JRPCBody('add_dining', dining);
        let response = await JRPCRequest(getDiningBody);
        dining_id = JSON.parse(response.result);
        setDining(dining_id);
    };

    useEffect(() => {
        GetRestaurants(setRestaurants);
    }, []);

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
                    <h2>Dining </h2>
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
                    <Controller
                        name='unixTimestamp'
                        control={control}
                        rules={{ required: true }}
                        defaultValue={Math.floor(
                            Date.now() / 1000,
                        )}
                        render={({
                            field: { onChange, value },
                        }) => (
                            <LocalizationProvider
                                dateAdapter={AdapterDayjs}
                            >
                                <DateTimePicker
                                    views={[
                                        'year',
                                        'month',
                                        'day',
                                        'hours',
                                        'minutes',
                                        'seconds',
                                    ]}
                                    // value={dayjs(value)}
                                    defaultValue={dayjs(
                                        Date.now(),
                                    )}
                                    onChange={(
                                        newValue,
                                    ) => {
                                        if (newValue) {
                                            if (
                                                newValue.isValid()
                                            ) {
                                                onChange(
                                                    newValue.unix(),
                                                );
                                            }
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        )}
                    />
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

export default DiningEditor;
