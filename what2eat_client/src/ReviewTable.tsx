import NavigationBar from './NavigationBar';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { useState, useEffect } from 'react';
import { v4 as UUID } from 'uuid';
import { Config } from './config';

interface Data {
    uuid: string;
    reviewer: string;
    restaurant: string;
    score: number;
    comment: string;
    createdAt: Date;
}

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '15%',
    left: '50%',
    transform: 'translate(-50%, 0%)',
    width: "100%",
    bgcolor: 'background.paper',
    borderColor: 'primary.main',
    // border: '1px solid #3399ff',
    boxShadow: 24,
    borderRadius: 2,
    pt: 2,
    px: 4,
    pb: 3,
};

function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label='first page'
            >
                {theme.direction === 'rtl' ? (
                    <LastPageIcon />
                ) : (
                    <FirstPageIcon />
                )}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label='previous page'
            >
                {theme.direction === 'rtl' ? (
                    <KeyboardArrowRight />
                ) : (
                    <KeyboardArrowLeft />
                )}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label='next page'
            >
                {theme.direction === 'rtl' ? (
                    <KeyboardArrowLeft />
                ) : (
                    <KeyboardArrowRight />
                )}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label='last page'
            >
                {theme.direction === 'rtl' ? (
                    <FirstPageIcon />
                ) : (
                    <LastPageIcon />
                )}
            </IconButton>
        </Box>
    );
}

const ReviewTable = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
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
            let resp = await fetch(Config.serverIP, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(jsonRPCBody),
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            });
            let result = (await resp.json()).result;
            let reviews = JSON.parse(result);
            reviews.reverse();
            setReviews(reviews);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - reviews.length) : 0;

    const visibleRows = React.useMemo(() => {
        return reviews.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage,
        );
    }, [page, rowsPerPage, reviews]);

    return (
        <>
            <NavigationBar />
            <TableContainer component={Paper} sx={style}>
                <Table sx={{ minWidth: 600 }} aria-label='simple table'>
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
                        {visibleRows.map((review: Data) => (
                            <TableRow
                                key={review.uuid}
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
                                    {review.createdAt.toString()}
                                </TableCell>
                            </TableRow>
                        ))}
                        {emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: 53 * emptyRows,
                                }}
                            >
                                <TableCell colSpan={5} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10]}
                    colSpan={3}
                    component='div'
                    sx={{justifyContent: "center", alignItems: "center", display: "flex", width: 999}}
                    count={reviews.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                />
            </TableContainer>
        </>
    );
};

export default ReviewTable;
