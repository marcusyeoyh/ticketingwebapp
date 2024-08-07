import React, { useState } from "react";
import { GetFullName } from "../../../../utils/GetUserInfo";
import { useNavigate } from "react-router-dom";
import { submitForm } from "../../../API";

// Component contains input fields for section 4 of a SLMP Transfer Request
// Responsible for sending input information to be saved in the Flask backend
// Allows for Accept and Reject options

// prop that stores id of request to be accepted
type SignAcceptProps = {
  id: string;
};

// current date to aid form filling
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const SignAccept: React.FC<SignAcceptProps> = ({ id }) => {
  const { fullname, ...rest } = GetFullName();
  const curDate = formatDate(new Date());
  const navigate = useNavigate();

  // state to store form input data
  const [approveData, setApproveData] = useState({
    id: id,
    FullName: fullname || "",
    Date: curDate || "",
    DivisionProgram: "",
    Remarks: "",
    Action: "",
  });

  // handle submission of form, with different actions for accept and reject
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (approveData["Action"] == "Accept") {
        const data = await submitForm(
          "/submitslmp/transfer/section4",
          approveData
        );
        console.log("Form approved successfully:", data["Request ID"]);
        navigate("/form-approved", {
          state: { formid: data["Request ID"] },
        });
      } else if (approveData["Action"] == "Reject") {
        const data = await submitForm(
          "/submitslmp/transfer/section4-reject",
          approveData
        );
        console.log("Form rejected successfully:", data["Request ID"]);
        navigate("/request-rejected", {
          state: { formid: data["Request ID"] },
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // handle input to fields in the form, upating the current data state with the most updated inputs from the user
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setApproveData({ ...approveData, [name]: value });
  };

  return (
    <div style={{ margin: "1rem" }}>
      <h5>Accept form below:</h5>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-3">
          <label htmlFor="id" className="form-label">
            Request ID:
          </label>
          <input
            className="form-control"
            id="id"
            name="id"
            value={approveData.id}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="FullName" className="form-label">
            Name of receiving side RO:
          </label>
          <input
            className="form-control"
            id="FullName"
            name="FullName"
            value={approveData.FullName}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="AcceptDate" className="form-label">
            Accept Date:
          </label>
          <input
            className="form-control"
            id="AcceptDate"
            name="Date"
            value={approveData.Date}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="DivisionProgram" className="form-label">
            Division / Program:
          </label>
          <input
            className="form-control"
            id="DivisionProgram"
            name="DivisionProgram"
            value={approveData.DivisionProgram}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="remarks" className="form-label">
            Approver's Remarks
          </label>
          <textarea
            className="form-control"
            id="remarks"
            rows={3}
            name="Remarks"
            placeholder="Please state reason if request is rejected"
            value={approveData.Remarks}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="col-12 d-flex justify-content-center">
          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginRight: "1rem" }}
            onClick={() => {
              setApproveData({ ...approveData, Action: "Accept" });
            }}
          >
            Accept Request
          </button>
          <button
            type="submit"
            className="btn btn-danger"
            style={{ marginLeft: "1rem" }}
            onClick={() => {
              setApproveData({ ...approveData, Action: "Reject" });
            }}
          >
            Reject Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignAccept;
