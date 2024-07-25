import React, { useState } from "react";
import { loginUser } from "../components/API";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData.username, formData.password);
      if (response.length > 0) {
        setUser(response[0]);
        navigate("/");
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      alert("Login failed. Please try again");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        <h3 className="d-flex justify-content-center">
          Ticket Tracking & Approval System
        </h3>
        <h6 className="d-flex justify-content-center">
          Please log in to use the application:
        </h6>
        <form
          onSubmit={handleSubmit}
          className="row g-3 d-flex justify-content-center"
        >
          <div className="col-md-6">
            <label htmlFor="Username" className="form-label">
              Username:
            </label>
            <input
              className="form-control"
              id="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="Password" className="form-label">
              Password:
            </label>
            <input
              className="form-control"
              id="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12 d-flex justify-content-center">
            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginRight: "1rem" }}
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
