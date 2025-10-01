// src/App.js
import React from 'react';
import { Navigate, Route, Routes, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { history } from './helpers';

import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';

import PrivateLayout from './layouts/PrivateLayout';

import LoginPage from './pages/LoginPage/index';
import RegisterPage from './pages/RegisterPage/index';
import Home from './pages/HomePage/index';
import Profile from './pages/ProfilePage/index';
import Notes from "./pages/NotesPage";
import Tasks from "./pages/TasksPage";
import Finance from './pages/FinancePage';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
    return (
        <HistoryRouter
            history={history}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Routes>
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<PrivateLayout />}>
                        <Route index element={<Home />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="notes" element={<Notes />} />
                        <Route path="tasks" element={<Tasks />} />
                        <Route path="finance" element={<Finance />} />
                    </Route>
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </HistoryRouter>
    );
}

export default App;
