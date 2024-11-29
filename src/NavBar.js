// src/NavBar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    const [activeMenu, setActiveMenu] = useState('/'); // Default active menu

    const handleMenuClick = (path) => {
        setActiveMenu(path); // Update active menu when clicked
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <h1>MyApp</h1>
            </div>
            <ul className="nav-list">
                <li>
                    <Link
                        to="/"
                        className={`nav-link ${activeMenu === '/' ? 'active' : ''}`}
                        onClick={() => handleMenuClick('/')}
                    >
                        Home
                    </Link>
                </li>
                <li>
                    <Link
                        to="/list-cards"
                        className={`nav-link ${activeMenu === '/list-cards' ? 'active' : ''}`}
                        onClick={() => handleMenuClick('/list-cards')}
                    >
                        My Cards
                    </Link>
                </li>
                <li>
                    <Link
                        to="/add-card"
                        className={`nav-link ${activeMenu === '/add-card' ? 'active' : ''}`}
                        onClick={() => handleMenuClick('/add-card')}
                    >
                        Add Card
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
