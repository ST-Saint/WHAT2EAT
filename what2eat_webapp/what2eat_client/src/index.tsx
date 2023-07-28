import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ReviewEditor from './ReviewEditor';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ExpenseEditor from './ExpenseEditor';

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
        path: '/expenseeditor',
        element: <ExpenseEditor />,
    }
    // TODO(display table): add new router
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
