import DiningEditor from './DiningEditor';
import DishEditor from './DishEditor';
import { Dish, Dining } from './DishEditor';
import NavigationBar from './NavigationBar';
import {
    JRPCRequest,
    JRPCBody,
    GetRestaurants,
    GetDinings,
    GetDishes,
} from './RPC/JRPCRequest';
import { Config } from './config';
import { css } from '@emotion/css';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import React from 'react';
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { v4 as UUID } from 'uuid';

interface reviewForm {
    dining: string;
    diningRestaurant: string;
    reviewer: string;
    restaurant: string;
    score: number;
    dishes: string[];
    scores: number[];
    comment: string;
    date: Date;
    uuid: string;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

const ReviewEditor = () => {
    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<reviewForm>({
        defaultValues: {
            dishes: [''],
            score: 0,
            scores: [0],
            restaurant: '',
        },
    });

    let [confirmPopup, setConfirmPopup] = useState(false);

    // response status code
    // 0: sent but not yield yet
    // -1: network error
    // number: http status code
    let [response, setResponse] = useState(0);

    let [responseMessage, setResponseMessage] =
        useState('');
    let [reviewers, setReviewers] = useState(['']);
    let [restaurants, setRestaurants] = useState(['']);
    let [dinings, setDinings] = useState<Dining[]>([]);
    let [candidateDishes, setCandidateDishes] = useState<
        Dish[]
    >([]);

    const handleScoresChange = (
        index: number,
        value: string,
    ) => {
        const currentScores = getValues('scores');
        let updatedScores = [...currentScores];
        updatedScores[index] = isNaN(value as any)
            ? 0
            : parseFloat(value);
        setValue('scores', updatedScores);
    };

    const handleDishesChange = (
        index: number,
        value: string,
    ) => {
        const currentDishes = getValues('dishes');
        const currentScores = getValues('scores');
        let updatedDishes = [...currentDishes];
        let updatedScores = [...currentScores];
        updatedDishes[index] = value;
        setValue('dishes', updatedDishes);
        if (
            index === updatedDishes.length - 1 &&
            value !== ''
        ) {
            updatedDishes.push('');
            updatedScores.push(getValues('score') || 0);
            setValue('dishes', updatedDishes);
            setValue('scores', updatedScores);
        } else if (index === updatedDishes.length - 2) {
            let resized = false;
            while (
                index >= 0 &&
                (updatedDishes[index] === null ||
                    updatedDishes[index] === '')
            ) {
                resized = true;
                updatedDishes.splice(index, 1);
                updatedScores.splice(index, 1);
                --index;
            }
            if (resized) {
                setValue('dishes', updatedDishes);
                setValue('scores', updatedScores);
            }
        }
    };

    let dishes = watch('dishes', ['']);
    let scores = watch('scores', [0]);
    let reviewer = watch('reviewer', '');

    let dishFields = (
        <Grid container xs={12} item>
            <Grid xs={9} item>
                <Stack spacing={2}>
                    {dishes.map((value, index) => (
                        <Autocomplete
                            freeSolo
                            onChange={(event, value) => {
                                // handleInputChange(index, value);
                            }}
                            key={index}
                            value={value}
                            onInputChange={(
                                event,
                                value,
                            ) => {
                                handleDishesChange(
                                    index,
                                    value,
                                );
                            }}
                            options={candidateDishes.map(
                                (candidateDishes: any) =>
                                    candidateDishes.name,
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={`Dish ${
                                        index + 1
                                    }`}
                                    InputProps={{
                                        ...params.InputProps,
                                        type: 'search',
                                    }}
                                />
                            )}
                        />
                    ))}
                </Stack>
            </Grid>
            <Grid xs={3} item>
                <Stack spacing={2}>
                    {scores.map((value, index) => {
                        return (
                            <TextField
                                label='Score'
                                type='number'
                                key={index}
                                error={
                                    isNaN(scores[index]) ||
                                    scores[index] > 100
                                }
                                value={value}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    handleScoresChange(
                                        index,
                                        event.target.value,
                                    );
                                }}
                                inputProps={{
                                    step: 'any',
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        );
                    })}
                </Stack>
            </Grid>
        </Grid>
    );

    const getReviewers = async () => {
        let getReviewersBody = JRPCBody('get_reviewers');
        let response = await JRPCRequest(getReviewersBody);
        let reviewers = JSON.parse(response.result);
        setReviewers(reviewers);
    };

    useEffect(() => {
        getReviewers();
        GetDinings((dining: any) => {
            setDinings(dining.reverse());
        });
        GetRestaurants((restaurants: any) => {
            setRestaurants(restaurants.reverse());
        });
    }, []);

    const getScoresAverage = () => {
        let res = 0,
            cnt = 0;
        for (let val of scores) {
            if (!isNaN(val)) {
                res += val;
                ++cnt;
            }
        }
        return res / cnt;
    };

    const handleOpen = () => {
        setConfirmPopup(true);
    };
    const handleClose = () => {
        if (response != 0) {
            setConfirmPopup(false);
        }
    };

    async function updateRestaurant(
        dining_restaurant: string,
    ) {
        let restaurant = dining_restaurant.split(' | ')[0];
        setValue('restaurant', restaurant);
        let restaurantDishes = await GetDishes(restaurant);
        setCandidateDishes(restaurantDishes);

        let dining_id = dining_restaurant
            .split(' | ')
            .pop();
        setValue('dining', dining_id || '');
        console.log(getValues('dining'));
    }

    const onSubmit: SubmitHandler<reviewForm> = async (
        review,
    ) => {
        handleOpen();

        review.date = new Date();
        review.uuid = UUID();
        let addReviewBody: any = JRPCBody(
            'submit_review_form',
            review,
        );
        // console.log(review);
        let response;
        setResponse(0);
        setResponseMessage('...');
        try {
            response = await JRPCRequest(addReviewBody);
            if (response != null && !response.ok) {
                /* Handle */
            }
            setResponse(response.status);
            // console.log((await response.json()).result);
            setResponseMessage(response.result);
            setValue('reviewer', '');
        } catch (error: any) {
            setResponse(-1);
            if (typeof error.message === 'string') {
                setResponseMessage(error.message);
            } else {
                setResponseMessage('UNKNOWN');
            }
            console.log(error);
        }
    };

    return (
        <>
            <NavigationBar />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={css`
                    display: flex;
                    justify-content: center;
                    margin-top: 5em;
                `}
            >
                <Stack spacing={2} sx={{ width: 600 }}>
                    <h2>Review </h2>
                    <Controller
                        name='reviewer'
                        control={control}
                        rules={{ required: true }}
                        render={({
                            field: { onChange, value },
                        }) => (
                            <Autocomplete
                                freeSolo
                                value={
                                    watch('reviewer') || ''
                                }
                                inputValue={value || ''}
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
                                options={reviewers.map(
                                    (reviewer: any) =>
                                        reviewer.name,
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label='Reviewer'
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
                        name='diningRestaurant'
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
                                    updateRestaurant(value);
                                    onChange(value);
                                }}
                                options={dinings.map(
                                    (dining: any) =>
                                        dining.restaurant +
                                        ' | ' +
                                        dayjs
                                            .unix(
                                                dining.unixTimestamp,
                                            )
                                            .format(
                                                'YYYY-MM-DD HH:MM',
                                            ) +
                                        ' | ' +
                                        dining.uuid,
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label='Dining'
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
                        name='restaurant'
                        control={control}
                        rules={{ required: true }}
                        render={({
                            field: { onChange, value },
                        }) => (
                            <TextField
                                disabled
                                label='Restaurant'
                                value={value}
                            />
                        )}
                    />

                    <Controller
                        name='score'
                        control={control}
                        rules={{ required: true }}
                        defaultValue={0}
                        render={({
                            field: { onChange, value },
                        }) => (
                            <TextField
                                label='Restaurant Score'
                                type='number'
                                defaultValue={0}
                                error={
                                    isNaN(value) ||
                                    value > 100
                                }
                                inputProps={{
                                    step: "any",
                                }}
                                helperText={
                                    isNaN(value) ||
                                    value > 100
                                        ? 'Score must be <= 100'
                                        : 'Avg:' +
                                          getScoresAverage()
                                }
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    let numeric = isNaN(
                                        event.target
                                            .value as any,
                                    )
                                        ? 0
                                        : parseFloat(
                                              event.target
                                                  .value,
                                          );
                                    onChange(numeric);
                                    if (
                                        (dishes.length ===
                                            1 &&
                                            dishes[0] ===
                                                '') ||
                                        reviewer === ''
                                    ) {
                                        setValue(
                                            'scores',
                                            [
                                                ...Array(
                                                    dishes.length,
                                                ).keys(),
                                            ].map(
                                                (i) =>
                                                    numeric,
                                            ),
                                        );
                                    }
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        )}
                    />
                    {dishFields}

                    <TextField
                        label='Comment'
                        multiline
                        maxRows={5}
                        {...register('comment')}
                    />
                    {errors.reviewer && (
                        <p>Reviewer is required</p>
                    )}
                    {/* TODO check form before submit*/}
                    <Button
                        type='submit'
                        variant='contained'
                    >
                        Submit
                    </Button>
                </Stack>
            </form>

            <Modal
                open={confirmPopup}
                onClose={handleClose}
                aria-labelledby='child-modal-title'
                aria-describedby='child-modal-description'
            >
                <Box sx={{ ...style }}>
                    <h2 id='child-modal-title'>
                        Sumbmit Sent
                    </h2>
                    <p id='child-modal-description'>
                        {responseMessage}
                    </p>
                    <Button
                        variant='contained'
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default ReviewEditor;
