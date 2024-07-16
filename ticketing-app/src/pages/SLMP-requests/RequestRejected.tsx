import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "./FormSubmitted.css";

// Page that is redirected to when a user has successfully rejected a request

const RequestRejected = () => {
  // obtain request id from state
  const location = useLocation();
  const { formid } = location.state || {};

  // allows for redirection back to home page
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/");
  };
  return (
    <>
      <NavBar />
      <div className="container">
        <i className="icon bi bi-check-circle"></i>
        <h1>Request Rejected</h1>
        {formid ? (
          <p>The request you rejected has ID: {formid}</p>
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

export default RequestRejected;
