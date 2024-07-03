import React from "react";
import NavBar from "../../components/NavBar";
import { useLocation, useNavigate } from "react-router-dom";
import "./FormSubmitted.css";

const FormSubmitted = () => {
  const location = useLocation();
  const { formid } = location.state || {};
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/");
  };
  return (
    <>
      <NavBar />
      <div className="container">
        <i className="icon bi bi-check-circle"></i>
        <h1>Request Submitted Successfully!</h1>
        {formid ? (
          <p>Your submitted request has ID: {formid}</p>
        ) : (
          <p>Form ID not found.</p>
        )}
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

export default FormSubmitted;
