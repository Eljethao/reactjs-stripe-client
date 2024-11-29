// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import ListCardsPage from './ListCardsPage';
import AddCardPage from './AddCardPage';
import NavBar from './NavBar';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/list-cards" element={<ListCardsPage />} />
        <Route path="/add-card" element={<AddCardPage />} />
      </Routes>
    </Router>
  );
};

export default App;
