import React from "react";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import "./SLMP-requests/FormSubmitted.css";

const UnauthorizedAccess = () => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate("/");
  };
  return (
    <>
      <NavBar />
      <div className="container">
        <i className="icon-stop bi bi-sign-stop"></i>
        <h1 style={{ marginBottom: "2rem" }}>
          You do not have the correct credentials to access this!
        </h1>
        <button
          type="button"
          className="btn btn-primary"
          style={{ backgroundColor: "#274472" }}
          onClick={handleButtonClick}
        >
          Return to Home
        </button>
      </div>
    </>
  );
};

export default UnauthorizedAccess;
