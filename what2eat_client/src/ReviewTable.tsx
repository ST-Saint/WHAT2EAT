import NavigationBar from './NavigationBar';
import {
    GetRestaurants,
    JRPCBody,
    JRPCRequest,
} from './RPC/JRPCRequest';
import { Config } from './config';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import React from 'react';
import { useState, useEffect } from 'react';
import { v4 as UUID } from 'uuid';

dayjs.extend(utc);
dayjs.extend(timezone);

interface Data {
    uuid: string;
    reviewer: string;
    restaurant: string;
    score: number;
    comment: string;
    createdAt: Date;
}

interface iReview {
    dining: string;
    reviewer: string;
    restaurant: string;
    score: number;
    comment: string;
    createdAt: Date;
    uuid: string;
}

interface iDishReview {
    uuid: string;
    review_id: string;
    dish: string;
    score: number;
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

function Chapters({ value }: { value: string }) {
    const chapters = value.split('\n');

    return (
        <List>
            {chapters.map((chapter: string, i: number) => (
                <ListItem key={i}>{chapter}</ListItem>
            ))}
        </List>
    );
}

const style = {
    position: 'absolute' as 'absolute',
    left: '50%',
    transform: 'translate(-50%, 0%)',
    width: '100%',
    bgcolor: 'background.paper',
    borderColor: 'primary.main',
    boxShadow: 24,
    borderRadius: 2,
    pt: 2,
    px: 4,
    pb: 3,
};

function TablePaginationActions(
    props: TablePaginationActionsProps,
) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } =
        props;

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
        onPageChange(
            event,
            Math.max(0, Math.ceil(count / rowsPerPage) - 1),
        );
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
                disabled={
                    page >=
                    Math.ceil(count / rowsPerPage) - 1
                }
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
                disabled={
                    page >=
                    Math.ceil(count / rowsPerPage) - 1
                }
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

const ReviewRow = (props: { review: Data }) => {
    const { review } = props;
    const [open, setOpen] = React.useState(false);
    const [dishesReview, setDishesReview] = React.useState<
        iDishReview[]
    >([]);

    const getDishesReview = async (review_id: string) => {
        let dishesByReviewBody = JRPCBody(
            'get_dishes_by_review',
            { review_id: review_id },
        );
        let response = await JRPCRequest(
            dishesByReviewBody,
        );
        let dishesReview: iDishReview[] = JSON.parse(
            response.result,
        );
        setDishesReview(dishesReview);
    };

    const toggleReviewDetail = async (
        review_id: string,
    ) => {
        setOpen(!open);
        if (dishesReview.length == 0) {
            getDishesReview(review_id);
        }
    };

    const dishReviewRow = (dishReview: iDishReview) => {
        return (
            <React.Fragment>
                <TableCell
                    sx={{
                        width: '30%',
                    }}
                >
                    {dishReview.dish}
                </TableCell>
                <TableCell
                    align='center'
                    sx={{
                        width: '0%',
                    }}
                >
                    {dishReview.score}
                </TableCell>
                <TableCell
                    sx={{
                        width: '0%',
                    }}
                ></TableCell>
            </React.Fragment>
        );
    };
    const dishReviewRowComment = () => {
        return (
            <TableCell
                align='center'
                rowSpan={dishesReview.length}
                sx={{
                    width: '60%',
                }}
            >
                <Chapters value={review.comment} />
            </TableCell>
        );
    };

    const dishReviewDetails = dishesReview.map(
        (dishReview: iDishReview, index: number) => {
            if (index == 0) {
                return (
                    <TableRow>
                        {dishReviewRow(dishReview)}
                        {dishReviewRowComment()}
                    </TableRow>
                );
            } else {
                return (
                    <TableRow>
                        {dishReviewRow(dishReview)}
                    </TableRow>
                );
            }
        },
    );

    return (
        <React.Fragment>
            <TableRow
                key={review.uuid}
                sx={{
                    '&:last-child td, &:last-child th': {
                        border: 0,
                    },
                }}
                onClick={() => {
                    toggleReviewDetail(review.uuid);
                }}
            >
                <TableCell
                    component='th'
                    scope='row'
                    align='left'
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
                    {dayjs(review.createdAt)
                        .tz('America/Vancouver')
                        .format('YYYY-MM-DD HH:MM')}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{
                        paddingBottom: open ? '1em' : 0,
                        paddingTop: open ? '0.5em' : 0,
                    }}
                    colSpan={6}
                >
                    <Collapse
                        in={open}
                        timeout='auto'
                        unmountOnExit
                    >
                        <Table
                            size='small'
                            sx={{
                                width: '100%',
                                margin: 'auto',
                            }}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        sx={{ border: 0 }}
                                    >
                                        Dishes
                                    </TableCell>
                                    <TableCell
                                        sx={{ border: 0 }}
                                        align='center'
                                    >
                                        Score
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: 0,
                                        }}
                                    ></TableCell>
                                    <TableCell
                                        sx={{ border: 0 }}
                                        align='center'
                                    >
                                        Comment
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dishReviewDetails}
                            </TableBody>
                        </Table>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
};

const ReviewTable = () => {
    const [pageIndex, setPageIndex] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] =
        React.useState(10);
    let [reviews, setReviews] = useState([]);
    let [filter, setFilter] = React.useState('');
    let [filteredReviews, setFilteredReviews] =
        React.useState<iReview[]>([]);

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
                headers: {
                    'Content-Type':
                        'application/json; charset=UTF-8',
                },
            });
            let result = (await resp.json()).result;
            let reviews = JSON.parse(result);
            reviews.reverse();
            setReviews(reviews);
            setFilteredReviews(reviews);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangePageIndex = (
        event: unknown,
        newPageIndex: number,
    ) => {
        let pageLimit = Math.trunc(
            (reviews.length - 1) / rowsPerPage,
        );
        setPageIndex(Math.min(newPageIndex, pageLimit));
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPageIndex(0);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        pageIndex > 0
            ? Math.max(
                  0,
                  (1 + pageIndex) * rowsPerPage -
                      filteredReviews.length,
              )
            : 0;

    const visibleRows = React.useMemo(() => {
        return filteredReviews.slice(
            pageIndex * rowsPerPage,
            pageIndex * rowsPerPage + rowsPerPage,
        );
    }, [pageIndex, rowsPerPage, filteredReviews]);

    function reviewToString(review: iReview) {
        return [
            review.reviewer,
            review.restaurant,
            review.comment,
            review.score,
            review.createdAt,
        ].join('\n');
    }

    return (
        <>
            <NavigationBar />
            <TextField
                fullWidth
                label='Search Field'
                id='Search Field'
                margin='normal'
                value={filter}
                onChange={(
                    event: React.ChangeEvent<HTMLInputElement>,
                ) => {
                    let filter = event.target.value;
                    setFilter(filter);
                    if (filter != '') {
                        const filterReg = new RegExp(
                            filter,
                            'i',
                        );
                        let fReviews = reviews.filter(
                            (review: iReview) => {
                                return (
                                    reviewToString(
                                        review,
                                    ).search(filterReg) !=
                                    -1
                                );
                            },
                        );
                        let pageLimit = Math.trunc(
                            (fReviews.length - 1) /
                                rowsPerPage,
                        );
                        setPageIndex(
                            Math.min(pageIndex, pageLimit),
                        );
                        setFilteredReviews(fReviews);
                    } else {
                        let pageLimit = Math.trunc(
                            (reviews.length - 1) /
                                rowsPerPage,
                        );
                        setPageIndex(
                            Math.min(pageIndex, pageLimit),
                        );
                        setFilteredReviews(reviews);
                    }
                }}
            />
            <TableContainer component={Paper} sx={style}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Restaurant
                            </TableCell>
                            <TableCell align='center'>
                                Reviewer
                            </TableCell>
                            <TableCell align='center'>
                                Score
                            </TableCell>
                            <TableCell align='center'>
                                Date
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleRows.map((review: Data) => (
                            <ReviewRow review={review} />
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
                    sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        width: '100%',
                    }}
                    count={filteredReviews.length}
                    rowsPerPage={rowsPerPage}
                    page={pageIndex}
                    onPageChange={handleChangePageIndex}
                    onRowsPerPageChange={
                        handleChangeRowsPerPage
                    }
                    ActionsComponent={
                        TablePaginationActions
                    }
                />
            </TableContainer>
        </>
    );
};

export default ReviewTable;
