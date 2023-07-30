import NavigationBar from './NavigationBar';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React from 'react';
import { useState, useEffect } from 'react';
import { v4 as UUID } from 'uuid';

interface Data {
    reviewer: string;
    restaurant: string;
    score: number;
    comment: string;
    date: string;
}

const ReviewTable = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    let [reviews, setReviews] = useState([]);

    useEffect(() => {
        getReviews();
    }, []);

    const getReviews = async () => {
        let jsonRPCBody: any = {
            jsonrpc: '2.0',
            method: 'get_reviews',
            params: {},
            id: UUID(),
        };
        try {
            let resp = await fetch('http://localhost:5000', {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(jsonRPCBody),
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            });
            let result = (await resp.json()).result;
            console.log(result);
            setReviews(result);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <NavigationBar />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>Restaurant</TableCell>
                            <TableCell align='center'>Reviewer</TableCell>
                            <TableCell align='center'>Score</TableCell>
                            <TableCell align='center'>Comment</TableCell>
                            <TableCell align='center'>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reviews.map((review: Data) => (
                            <TableRow
                                key={review.restaurant}
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell
                                    component='th'
                                    scope='row'
                                    align='center'
                                >
                                    {review.restaurant}
                                </TableCell>
                                <TableCell align='center'>
                                    {review.reviewer}
                                </TableCell>
                                <TableCell align='center'>
                                    {review.score}
                                </TableCell>
                                <TableCell align='center'>
                                    {review.comment}
                                </TableCell>
                                <TableCell align='center'>
                                    {review.date}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default ReviewTable;
