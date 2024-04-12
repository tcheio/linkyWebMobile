import React from 'react';
import { NavLink } from 'react-router-dom';
import "../assets/style/navbar.css"

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        <li className="navbar-item">
          <NavLink to="/" className="navbar-link" activeClassName="active">
            Home
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink to="/news" className="navbar-link" activeClassName="active">
            Global
          </NavLink>
        </li>
        {/* Add more links as needed */}
      </ul>
    </nav>
  );
}

export default Navbar;