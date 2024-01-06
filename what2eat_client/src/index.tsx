import App from './App';
import ExpenseEditor from './ExpenseEditor';
import ReviewEditor from './ReviewEditor';
import ReviewTable from './ReviewTable';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { css } from '@emotion/css';
import Dining from "./Dining";

const router = createBrowserRouter([
    {
        path: '/helloworld',
        element: <div>Hello world!</div>,
    },
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/revieweditor',
        element: <ReviewEditor />,
    },
    {
        path: 'dining',
        element: <Dining />,
    },
    // {
    //     path: '/expenseeditor',
    //     element: <ExpenseEditor />,
    // },
    {
        path: '/reviewtable',
        element: <ReviewTable />,
    },
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
        <footer className={css`margin-bottom: 5%`} />
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
