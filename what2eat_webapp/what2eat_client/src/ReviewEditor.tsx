import { css } from '@emotion/css';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { v4 as UUID } from 'uuid';
import NavigationBar from './NavigationBar';

interface reviewForm {
    reviewer: string;
    restaurant: string;
    dish: string;
    score: number;
    comment: string;
    date: Date;
}

const ReviewEditor = () => {
    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<reviewForm>();

    const reviwers: string[] = [];
    const restaurants: string[] = [];
    const dishes: string[] = [];

    const onSubmit: SubmitHandler<reviewForm> = async (review) => {
        review.date = new Date();
        let jsonRPCBody: any = {
            jsonrpc: '2.0',
            method: 'add_review',
            params: { review: review },
            id: UUID(),
        };
        console.log(review);
        let response;
        try {
            response = await fetch('http://localhost:8080', {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(jsonRPCBody),
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            });
            if (response != null && !response.ok) {
                /* Handle */
            }
            console.log(response.body);
        } catch (error) {}
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
                    {/* register your input into the hook by invoking the "register" function */}

                    <Controller
                        name='reviewer'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <Autocomplete
                                freeSolo
                                onChange={(event, value) => {
                                    onChange(value);
                                }}
                                onInputChange={(event, value) => {
                                    onChange(value);
                                }}
                                disableClearable
                                options={reviwers.map((reviewer) => reviewer)}
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
                        name='restaurant'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <Autocomplete
                                freeSolo
                                onChange={(event, value) => {
                                    onChange(value);
                                }}
                                onInputChange={(event, value) => {
                                    onChange(value);
                                }}
                                disableClearable
                                options={restaurants.map(
                                    (restaurant) => restaurant,
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
                        name='dish'
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Autocomplete
                                freeSolo
                                onChange={(event, value) => {
                                    onChange(value);
                                }}
                                onInputChange={(event, value) => {
                                    onChange(value);
                                }}
                                disableClearable
                                options={dishes.map((dish) => dish)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label='Dish'
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
                        name='score'
                        control={control}
                        rules={{ required: true }}
                        defaultValue={0}
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                label='Score'
                                type='number'
                                defaultValue={0}
                                error={isNaN(value) || value > 100}
                                helperText={
                                    isNaN(value) || value > 100
                                        ? 'Score must be <= 100'
                                        : ''
                                }
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    onChange(event.target.value);
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        )}
                    />

                    <TextField
                        label='Comment'
                        multiline
                        maxRows={5}
                        {...register('comment')}
                    />
                    {errors.reviewer && <p>Reviewer is required</p>}

                    <Button type='submit' variant='contained'>
                        Submit
                    </Button>
                </Stack>
            </form>
        </>
    );
};

export default ReviewEditor;
