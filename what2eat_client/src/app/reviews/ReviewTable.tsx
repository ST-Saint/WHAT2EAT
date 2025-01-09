import {
    JRPCBody,
    JRPCRequest,
} from '@/app/RPC/JRPCRequest';

import { Config } from '@/app/config';

import {
    Button,
    Input,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Textarea,
} from '@nextui-org/react';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { v4 as UUID } from 'uuid';

import {
    faCircleChevronDown,
    faCircleChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

dayjs.extend(utc);
dayjs.extend(timezone);

interface IReviewData {
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
    comment: string | null;
    score: number;
}

const ReviewDetailTable = (props: {
    review: IReviewData;
    dishReviews: iDishReview[];
}) => {
    const { review, dishReviews } = props;

    return (
        <div className='flex flex-col justify-center'>
            <Table aria-label='Review Comment Table'>
                <TableHeader>
                    <TableColumn key='comment'>
                        Restaurant Comment
                    </TableColumn>
                </TableHeader>
                <TableBody items={[review]}>
                    <TableRow key={review.uuid}>
                        <TableCell>
                            <Textarea
                                isReadOnly
                                minRows={1}
                                defaultValue={
                                    review.comment
                                }
                            ></Textarea>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <Table aria-label='Review Details Table'>
                <TableHeader>
                    <TableColumn key='dish'>
                        Dish
                    </TableColumn>
                    <TableColumn key='score'>
                        Score
                    </TableColumn>
                    <TableColumn key='comment'>
                        Comment
                    </TableColumn>
                </TableHeader>
                <TableBody items={dishReviews}>
                    {(dish) => (
                        <TableRow key={dish.uuid}>
                            <TableCell>
                                {dish.dish}
                            </TableCell>
                            <TableCell>
                                {dish.score}
                            </TableCell>
                            <TableCell>
                                {dish.comment}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

const ToggleSubRowButton = (props: {
    review: IReviewData;
}) => {
    const { review } = props;
    const [isExpanded, setIsExpanded] = useState(false);

    const [dishReviews, setDishReviews] = React.useState<
        iDishReview[]
    >([]);

    const updateDishReviews = async (review_id: string) => {
        const dishesByReviewBody = JRPCBody(
            'get_dishes_by_review',
            { review_id: review_id },
        );
        const response = await JRPCRequest(
            dishesByReviewBody,
        );
        const dishReviews: iDishReview[] = JSON.parse(
            response.result,
        );
        setDishReviews(dishReviews);
    };

    useEffect(() => {
        updateDishReviews(review.uuid);
    }, [review]);

    const toggleSubRow = () => {
        console.log('click');
        const rowToInsertAfter = document.getElementById(
            `tr-${review.uuid}`,
        );

        if (rowToInsertAfter) {
            console.log('find row', rowToInsertAfter);
            if (isExpanded) {
                const existingRow = document.getElementById(
                    `tsr-${review.uuid}`,
                );
                if (existingRow) {
                    existingRow.remove();
                }
            } else {
                const newRow = document.createElement('tr');
                newRow.id = `tsr-${review.uuid}`;
                const newCell =
                    document.createElement('td');
                newCell.colSpan = 100;
                newCell.className = 'px-4 py-4';

                const root = createRoot(newCell);
                root.render(
                    <ReviewDetailTable
                        review={review}
                        dishReviews={dishReviews}
                    />,
                );

                newRow.appendChild(newCell);
                rowToInsertAfter.insertAdjacentElement(
                    'afterend',
                    newRow,
                );
            }

            setIsExpanded(!isExpanded);
        }
    };

    return (
        <Button
            onClick={toggleSubRow}
            size='sm'
            variant='light'
            isIconOnly
        >
            {isExpanded ? (
                <FontAwesomeIcon icon={faCircleChevronUp} />
            ) : (
                <FontAwesomeIcon
                    icon={faCircleChevronDown}
                />
            )}
        </Button>
    );
};

const ReviewTable = () => {
    const [pageIndex, setPageIndex] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] =
        React.useState(12);
    const [reviews, setReviews] = useState([]);
    const [filter, setFilter] = React.useState('');
    const [filteredReviews, setFilteredReviews] =
        React.useState<iReview[]>([]);

    useEffect(() => {
        getReviews();
    }, []);

    const getReviews = async () => {
        const jsonRPCBody: any = {
            jsonrpc: '2.0',
            method: 'get_reviews',
            params: {},
            id: UUID(),
        };
        try {
            const resp = await fetch(Config.serverIP, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(jsonRPCBody),
                headers: {
                    'Content-Type':
                        'application/json; charset=UTF-8',
                },
            });
            const result = (await resp.json()).result;
            const reviews = JSON.parse(result);
            reviews.reverse();
            setReviews(reviews);
            setFilteredReviews(reviews);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangePageIndex = (
        newPageIndex: number,
    ) => {
        const pageLimit = Math.trunc(
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
            (pageIndex - 1) * rowsPerPage,
            pageIndex * rowsPerPage,
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
        <div className='text-xl w-full'>
            <Input
                fullWidth
                label='Search Field'
                id='Search Field'
                value={filter}
                size='sm'
                onChange={(
                    event: React.ChangeEvent<HTMLInputElement>,
                ) => {
                    const filter = event.target.value;
                    setFilter(filter);
                    if (filter != '') {
                        const filterReg = new RegExp(
                            filter,
                            'i',
                        );
                        const fReviews = reviews.filter(
                            (review: iReview) => {
                                return (
                                    reviewToString(
                                        review,
                                    ).search(filterReg) !=
                                    -1
                                );
                            },
                        );
                        const pageLimit = Math.trunc(
                            (fReviews.length - 1) /
                                rowsPerPage,
                        );
                        setPageIndex(
                            Math.min(pageIndex, pageLimit),
                        );
                        setFilteredReviews(fReviews);
                    } else {
                        const pageLimit = Math.trunc(
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
            <Table
                aria-label='Review Table'
                className='mt-[2vh]'
                bottomContentPlacement='outside'
                bottomContent={
                    <div className='flex w-full justify-center'>
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            total={filteredReviews.length}
                            page={pageIndex}
                            onChange={handleChangePageIndex}
                        />
                    </div>
                }
            >
                <TableHeader>
                    <TableColumn key='restaurant'>
                        Restaurant
                    </TableColumn>
                    <TableColumn key='reviewer'>
                        Reviewer
                    </TableColumn>
                    <TableColumn key='score'>
                        Score
                    </TableColumn>
                    <TableColumn key='date'>
                        Date
                    </TableColumn>
                    <TableColumn key='expand'>
                        Expand
                    </TableColumn>
                </TableHeader>
                <TableBody items={visibleRows}>
                    {(review) => (
                        <TableRow
                            key={review.uuid}
                            id={`tr-${review.uuid}`}
                        >
                            <TableCell>
                                {review.restaurant}
                            </TableCell>
                            <TableCell>
                                {review.reviewer}
                            </TableCell>
                            <TableCell>
                                {review.score}
                            </TableCell>
                            <TableCell>
                                {dayjs(review.createdAt)
                                    .tz('America/Vancouver')
                                    .format(
                                        'YYYY-MM-DD HH:MM',
                                    )}
                            </TableCell>
                            <TableCell>
                                <ToggleSubRowButton
                                    review={review}
                                />
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ReviewTable;
