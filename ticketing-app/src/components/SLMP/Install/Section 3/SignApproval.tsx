import React, { useState } from "react";
import { GetFullName } from "../../../../utils/GetUserInfo";
import { useNavigate } from "react-router-dom";
import { submitForm } from "../../../API";

type SignApprovalProp = {
  id: string;
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const SignApproval: React.FC<SignApprovalProp> = ({ id }) => {
  const { fullname, ...rest } = GetFullName();
  const curDate = formatDate(new Date());
  const navigate = useNavigate();
  const [approveData, setApproveData] = useState({
    id: id,
    FullName: fullname || "",
    ApproveDate: curDate || "",
    DivisionProgram: "",
    ApproveRemarks: "",
    Action: "",
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (approveData["Action"] == "Approve") {
        const data = await submitForm(
          "/submit_SLMP_Form-Install_sec3",
          approveData
        );
        console.log("Form approved successfully:", data["Request ID"]);
        navigate("/form-approved", {
          state: { formid: data["Request ID"] },
        });
      } else if (approveData["Action"] == "Reject") {
        const data = await submitForm(
          "/submit_SLMP_Form-Install_sec3_reject",
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
      <h5>Approve form below:</h5>
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
            Approver Full Name:
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
          <label htmlFor="ApproveDate" className="form-label">
            Approve Date:
          </label>
          <input
            className="form-control"
            id="ApproveDate"
            name="ApproveDate"
            value={approveData.ApproveDate}
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
            name="ApproveRemarks"
            placeholder="Please state reason if request is rejected"
            value={approveData.ApproveRemarks}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="col-12 d-flex justify-content-center">
          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginRight: "1rem" }}
            onClick={() => {
              setApproveData({ ...approveData, Action: "Approve" });
            }}
          >
            Approve Request
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

export default SignApproval;
