// Header.js

import React from 'react';
import './Header.css'; // Import the CSS file for styling

const Header = () => {
    return (
        <header className="header">
            <h1>Workout Plan Shamener</h1>
            <nav>
                <ul>
                    <li><a href="src/Components/Header/Header#home">Home</a></li>
                    <li><a href="src/Components/Header/Header#services">Services</a></li>
                    <li><a href="src/Components/Header/Header#about">About</a></li>
                    <li><a href="src/Components/Header/Header#contact">Contact</a></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
