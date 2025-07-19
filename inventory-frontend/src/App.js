import React from 'react';
import Layout from './compoments/Layout/ Layout';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import LoginForm from './compoments/LoginForm/LoginForm';
import Header from './compoments/Header/Header';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={<Layout />} />
        </Routes>
    );
}

export default App;
