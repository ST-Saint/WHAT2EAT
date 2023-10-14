import NavigationBar from './NavigationBar';
import { JRPCRequest, JRPCBody } from './RPC/JRPCRequest';
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
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import React from 'react';
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { v4 as UUID } from 'uuid';

interface expenseForm {
    restaurant: string;
    people: number;
    expense: number;
    date: Date;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

const ExpenseEditor = () => {
    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<expenseForm>();

    let [confirmPopup, setConfirmPopup] = useState(false);

    // response status code
    // 0: sent but not yield yet
    // -1: network error
    // number: http status code
    let [response, setResponse] = useState(0);

    let [responseMessage, setResponseMessage] =
        useState('');
    let [restaurants, setRestaurants] = useState([]);

    const getRestaurants = async () => {
        let getReviewersBody = JRPCBody('get_restaurants');
        let response = await JRPCRequest(getReviewersBody);
        let restaurants = JSON.parse(response.result);
        setRestaurants(restaurants);
    };

    useEffect(() => {
        getRestaurants();
    }, []);

    const handleOpen = () => {
        setConfirmPopup(true);
    };
    const handleClose = () => {
        if (response != 0) {
            setConfirmPopup(false);
        }
    };

    const onSubmit: SubmitHandler<expenseForm> = async (
        expense,
    ) => {
        handleOpen();
        expense.date = new Date();
        let jsonRPCBody: any = {
            jsonrpc: '2.0',
            method: 'add_expense',
            params: { expense: expense },
            id: UUID(),
        };
        // console.log(expense);
        let response;
        setResponse(0);
        setResponseMessage('...');
        try {
            response = await fetch(Config.serverIP, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(jsonRPCBody),
                headers: {
                    'Content-Type':
                        'application/json; charset=UTF-8',
                },
            });
            if (response != null && !response.ok) {
                /* Handle */
            }
            setResponse(response.status);
            // console.log(response.body);
            setResponseMessage(
                (await response.json()).result,
            );
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
                    {/* register your input into the hook by invoking the "register" function */}

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
                        name='people'
                        control={control}
                        rules={{ required: true }}
                        defaultValue={1}
                        render={({
                            field: { onChange, value },
                        }) => (
                            <TextField
                                label='Number of People'
                                type='number'
                                defaultValue={1}
                                error={
                                    isNaN(value) ||
                                    value < 1
                                }
                                helperText={
                                    isNaN(value) ||
                                    value < 1
                                        ? 'Score must be <= 100'
                                        : ''
                                }
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    onChange(
                                        event.target.value,
                                    );
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        )}
                    />
                    <Controller
                        name='expense'
                        control={control}
                        rules={{ required: true }}
                        defaultValue={0}
                        render={({
                            field: { onChange, value },
                        }) => (
                            <TextField
                                label='Expense'
                                type='number'
                                defaultValue={0}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    onChange(
                                        event.target.value,
                                    );
                                }}
                                inputProps={{
                                    step: 0.1,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        )}
                    />

                    {errors.restaurant && (
                        <p>Restaurant is required</p>
                    )}
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

export default ExpenseEditor;
