import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { NavLink } from "react-router-dom";
import "./NavBar.css";
import { useUser } from "../UserContext";
import { downloadFile } from "./API";

const NavBar = () => {
  const { user } = useUser();
  const fullName = user?.full_name;
  const handleClick = (e: React.FormEvent) => {
    e.preventDefault;
    downloadFile("uploads/User_Guide.pdf");
  };
  return (
    <nav className="navbar sticky-top navbar-expand-lg navbar-custom">
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center" href="/">
          <i className="bi bi-telegram"></i>
          <h3>Ticketing System</h3>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav me-auto mb-2 mb-lg-0">
            <NavLink
              exact="true"
              className="nav-link"
              activeClassName="active"
              to="/"
            >
              Home
            </NavLink>
            <NavLink
              exact="true"
              className="nav-link"
              activeClassName="active"
              to="/requests"
            >
              Make a request
            </NavLink>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={handleClick}>
                User Guide
              </a>
            </li>
          </div>
          <NavLink
            className="nav-link d-flex"
            activeClassName="active"
            to="/profile"
          >
            <i className="bi bi-person-circle"></i>
            <div>{fullName}</div>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
