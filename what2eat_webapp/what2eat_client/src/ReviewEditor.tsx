import { css } from '@emotion/css';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import React from 'react';
import { useState, useEffect } from 'react';
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
    uuid: string;
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

const ReviewEditor = () => {
    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,getValues,
        formState: { errors },
    } = useForm<reviewForm>();


    let [confirmPopup,
        setConfirmPopup] = useState(false);

    // response status code
    // 0: sent but not yield yet
    // -1: network error
    // number: http status code
    let [response, setResponse] = useState(0);

    let [responseMessage, setResponseMessage] = useState("");
    let [reviewers, setReviewers] = useState([]);
    let [restaurants, setRestaurants] = useState([]);
    let dishes: string[] = [];


    useEffect(() => {
        getReviewers();
        getRestaurants();
    }, []);


    const getReviewers = async () => {
        let jsonRPCBody: any = {
            jsonrpc: '2.0',
            method: 'get_reviewers',
            params: {},
            id: UUID(),
        };
        try {
            let resp = await fetch('http://128.189.17.124:5000', {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(jsonRPCBody),
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            });
            setReviewers((await resp.json()).result);
        } catch (error) {
            console.log(error);
        }
    };

    const getRestaurants = async () => {
        let jsonRPCBody: any = {
            jsonrpc: '2.0',
            method: 'get_restaurants',
            params: {},
            id: UUID(),
        };
        try {
            let resp = await fetch('http://128.189.17.124:5000', {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(jsonRPCBody),
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            });
            setRestaurants((await resp.json()).result);
        } catch (error) {
            console.log(error);
        }
    };

    const handleOpen = () => {
        setConfirmPopup(true);
    };
    const handleClose = () => {
        if( response !=0 ){
            setConfirmPopup(false);
        }
    };

    const onSubmit: SubmitHandler<reviewForm> = async (review) => {
        handleOpen();
        review.date = new Date();
        review.uuid = UUID();
        let jsonRPCBody: any = {
            jsonrpc: '2.0',
            method: 'add_review',
            params: { review: review },
            id: UUID(),
        };
        // console.log(review);
        let response;
        setResponse(0);
        setResponseMessage("...");
        try {
            response = await fetch('http://128.189.17.124:5000', {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(jsonRPCBody),
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            });
            if (response != null && !response.ok) {
                /* Handle */
            }
            setResponse(response.status);
            // console.log(response.body);
            setResponseMessage((await response.json()).result);
            setValue("reviewer", "");
        } catch (error: any) {
            setResponse(-1);
            if (typeof error.message === "string") {
                setResponseMessage(error.message);
            }else{
                setResponseMessage("UNKNOWN");
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
                        name='reviewer'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <Autocomplete
                                freeSolo
                                value={watch("reviewer") || ""}
                                inputValue={value || ""}
                                onChange={(event, value) => {
                                    onChange(value);
                                }}
                                onInputChange={(event, value) => {
                                    onChange(value);
                                }}
                                options={reviewers.map((reviewer) => reviewer)}
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
                                inputProps={{
                                    step: 0.1,
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
                    {/* TODO check form before submit*/}
                    <Button type='submit' variant='contained'>
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
                    <h2 id='child-modal-title'>Sumbmit Sent</h2>
                    <p id='child-modal-description'>
                        {responseMessage}
                    </p>
                    <Button variant='contained' onClick={handleClose }>Close</Button>
                </Box>
            </Modal>
        </>
    );
};

export default ReviewEditor;
