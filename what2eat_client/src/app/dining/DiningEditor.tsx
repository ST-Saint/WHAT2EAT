'use client';

import {
    GetRestaurants,
    JRPCBody,
    JRPCRequest,
} from '@/app/RPC/JRPCRequest';
import {
    ZonedDateTime,
    getLocalTimeZone,
    now,
} from '@internationalized/date';
import { Button, DatePicker } from '@nextui-org/react';
import React, {
    useEffect,
    useLayoutEffect,
    useState,
} from 'react';

import {
    Input,
    Autocomplete,
    AutocompleteItem,
    Form,
} from '@nextui-org/react';

import { v4 as UUID } from 'uuid';

interface Dining {
    uuid: string;
    unixTimestamp: number;
    restaurant: string;
    people: number;
    price: number;
}

interface IRestaurant {
    name: string;
}

export class Restaurant implements IRestaurant {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
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
        price: number,
    ) {
        this.uuid = uuid;
        this.unixTimestamp = unixTimestamp;
        this.restaurant = restaurant;
        this.people = people;
        this.price = price;
    }
}

type DiningProps = {
    setDining: (dining: string) => void;
};

const DiningEditor = ({ setDining }: DiningProps) => {
    const [submitted, setSubmitted] = useState(null);
    const [submitResp, setSubmitResp] =
        React.useState(null);
    const [restaurants, setRestaurants] = useState<
        Restaurant[]
    >([]);
    const [time, setTime] = useState<ZonedDateTime | null>(
        now(getLocalTimeZone()),
    );

    const onSubmit = async (event: any) => {
        event.preventDefault();
        const data = Object.fromEntries(
            new FormData(event.currentTarget),
        );
        const dining: Dining = {
            uuid: UUID(),
            unixTimestamp: Math.floor(
                time!.toDate().getTime() / 1000,
            ),
            restaurant: data.restaurant as string,
            people: data.people || 0,
            price: data.price || 0,
        };
        const getDiningBody = JRPCBody(
            'add_dining',
            dining,
        );

        setSubmitted(dining);
        const response = await JRPCRequest(getDiningBody);
        setSubmitResp(response);
        const dining_id = JSON.parse(response.result);
        setDining(dining_id);
    };

    useEffect(() => {
        GetRestaurants(setRestaurants);
        setTime(now(getLocalTimeZone()));
    }, []);

    useLayoutEffect(() => {}, []);

    return (
        <Form
            onSubmit={onSubmit}
            validationBehavior='native'
            className='w-[75%] flex flex-col items-center space-y-3'
        >
            <h1 className='text-3xl font-bold mb-4 leading-relaxed'>
                Dining
            </h1>
            <Autocomplete
                isRequired
                variant='bordered'
                radius='sm'
                size='lg'
                name='restaurant'
                placeholder='Restaurant'
                defaultItems={restaurants}
            >
                {(restaurant) => (
                    <AutocompleteItem key={restaurant.name}>
                        {restaurant.name}
                    </AutocompleteItem>
                )}
            </Autocomplete>
            <DatePicker
                isRequired
                radius='sm'
                size='lg'
                variant='bordered'
                hideTimeZone
                showMonthAndYearPickers
                selectorButtonPlacement='start'
                value={time}
                onChange={setTime}
            />
            <Button
                type='submit'
                color='primary'
                fullWidth={true}
                radius='sm'
                className='font-bold text-base'
            >
                SUBMIT
            </Button>
            {submitted && (
                <div className='items-start w-full'>
                    <div className='text-small text-default-500 mt-4 mb-4'>
                        Response data:{' '}
                        <pre>
                            {JSON.stringify(
                                submitResp,
                                null,
                                2,
                            )}
                        </pre>
                    </div>
                    <div className='text-small text-default-500 mt-4 mb-4'>
                        Submitted data:{' '}
                        <pre>
                            {JSON.stringify(
                                submitted,
                                null,
                                2,
                            )}
                        </pre>
                    </div>
                </div>
            )}
        </Form>
    );
};

export default DiningEditor;
