import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { NavLink } from "react-router-dom";
import "./NavBar.css";
import { useUser } from "../UserContext";
import { downloadFile } from "./API";

// Navigation bar that is sticked to the top of the application. Allows for navigation throughout the application

const NavBar = () => {
  // loads user context of logged in user
  const { user } = useUser();

  // loads full name of user account
  const fullName = user?.full_name;

  // function to handle click of the User Guide button. Enables the downloading of user guide
  const handleClick = (e: React.FormEvent) => {
    e.preventDefault;
    downloadFile("uploads/User_Guide.pdf");
  };

  return (
    <nav className="navbar sticky-top navbar-expand-lg navbar-custom">
      <div className="container-fluid">
        {/* Banner of application */}
        <a className="navbar-brand d-flex align-items-center" href="/">
          <i className="bi bi-telegram"></i>
          <h3>Ticketing System</h3>
        </a>
        {/* Button for collapsed navbar if window resolution is small */}
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
          {/* link to homepage */}
          <div className="navbar-nav me-auto mb-2 mb-lg-0">
            <NavLink
              exact="true"
              className="nav-link"
              activeClassName="active"
              to="/"
            >
              Home
            </NavLink>
            {/* link to make a request */}
            <NavLink
              exact="true"
              className="nav-link"
              activeClassName="active"
              to="/requests"
            >
              Make a request
            </NavLink>
            {/* button to download user guide */}
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={handleClick}>
                User Guide
              </a>
            </li>
          </div>
          <div className="d-flex">
            {user?.user_role == "Administrators" && (
              // privileged button to view all requests that is only visible if the user has the administrators role
              <NavLink
                exact="true"
                className="nav-link admin-viewall"
                activeClassName="active"
                to="/viewallreq"
              >
                View All Requests
              </NavLink>
            )}
            {/* button that shows the current logged in user, redirects to a profile page that shows the attributes of the user's account */}
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
      </div>
    </nav>
  );
};

export default NavBar;
