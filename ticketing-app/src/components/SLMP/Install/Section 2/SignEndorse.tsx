import React, { useState } from "react";
import { GetFullName } from "../../../../utils/GetUserInfo";
import { useNavigate } from "react-router-dom";
import { submitForm } from "../../../API";

type SignEndorseProp = {
  id: string;
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const SignEndorse: React.FC<SignEndorseProp> = ({ id }) => {
  const { fullname, ...rest } = GetFullName();
  const curDate = formatDate(new Date());
  const navigate = useNavigate();
  const [endorseData, setEndorseData] = useState({
    id: id,
    FullName: fullname || "",
    EndorseDate: curDate || "",
    DivisionProgram: "",
    Verification: "",
    Supported: "",
    Tracking: "",
    BlanketApproval: "",
    EndorseAdditionalInfo: "",
    EndorseRemarks: "",
    EndorseAttachment: null,
    Action: "",
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (endorseData["Action"] == "endorse") {
        const data = await submitForm(
          "/submitslmp/install/section2",
          endorseData
        );
        console.log("Form endorsed successfully:", data["Request ID"]);
        navigate("/form-endorsed", {
          state: { formid: data["Request ID"] },
        });
      } else if (endorseData["Action"] == "reject") {
        const data = await submitForm(
          "/submitslmp/install/section2-reject",
          endorseData
        );
        console.log("Form rejected:", data["Request ID"]);
        navigate("/request-rejected", {
          state: { formid: data["Request ID"] },
        });
      } else {
        return <div>Error</div>;
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
    const { name, value, files } = e.target as HTMLInputElement;
    if (files && files.length > 0) {
      setEndorseData({ ...endorseData, [name]: files[0] });
    } else {
      setEndorseData({ ...endorseData, [name]: value });
    }
  };
  return (
    <div style={{ margin: "1rem" }}>
      <h5>Endorse form below:</h5>
      <p>
        Software tracking is needed for Permissive, CopyLeft, Non-Commercial and
        Proprietary License
      </p>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-4">
          <label htmlFor="id" className="form-label">
            Request ID:
          </label>
          <input
            className="form-control"
            id="id"
            name="id"
            value={endorseData.id}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="FullName" className="form-label">
            Endorser Full Name:
          </label>
          <input
            className="form-control"
            id="FullName"
            name="FullName"
            value={endorseData.FullName}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="EndorseDate" className="form-label">
            Endorse Date:
          </label>
          <input
            className="form-control"
            id="EndorseDate"
            name="EndorseDate"
            value={endorseData.EndorseDate}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="DivisionProgram" className="form-label">
            Division / Program:
          </label>
          <input
            className="form-control"
            id="DivisionProgram"
            name="DivisionProgram"
            value={endorseData.DivisionProgram}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="selectVerification" className="form-label">
            Verification of Section 1 completed?
          </label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="Verification"
              id="isVerified"
              value="Yes"
              onChange={handleChange}
              required
            />
            <label className="form-check-label" htmlFor="isVerified">
              Yes
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="Verification"
              id="notVerified"
              value="No"
              onChange={handleChange}
              required
            />
            <label className="form-check-label" htmlFor="notVerified">
              No
            </label>
          </div>
        </div>
        <div className="col-md-4">
          <label htmlFor="selectSupported" className="form-label">
            Request Supported?
          </label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="Supported"
              id="isSupported"
              value="Yes"
              onChange={handleChange}
              required
            />
            <label className="form-check-label" htmlFor="isSupported">
              Yes
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="Supported"
              id="notSupported"
              value="No"
              onChange={handleChange}
              required
            />
            <label className="form-check-label" htmlFor="notSupported">
              No
            </label>
          </div>
        </div>
        <div className="col-md-4">
          <label htmlFor="selectTracking" className="form-label">
            Software Tracking Required?{" "}
          </label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="Tracking"
              id="isRequired"
              value="Yes"
              onChange={handleChange}
              required
            />
            <label className="form-check-label" htmlFor="isRequired">
              Yes
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="Tracking"
              id="notRequired"
              value="No"
              onChange={handleChange}
              required
            />
            <label className="form-check-label" htmlFor="notRequired">
              No
            </label>
          </div>
        </div>
        <div className="col-md-4">
          <label htmlFor="selectBlanketApproval" className="form-label">
            Software already in blanket approval list?
          </label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="BlanketApproval"
              id="isApproved"
              value="Yes"
              onChange={handleChange}
              required
            />
            <label className="form-check-label" htmlFor="isApproved">
              Yes
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="BlanketApproval"
              id="notApproved"
              value="No"
              onChange={handleChange}
              required
            />
            <label className="form-check-label" htmlFor="notApproved">
              No
            </label>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="additionalInfo" className="form-label">
            Additional Info on Software License:
          </label>
          <textarea
            className="form-control"
            id="additionalInfo"
            rows={3}
            placeholder="(Nil entry is required if there is no additional info)"
            name="EndorseAdditionalInfo"
            value={endorseData.EndorseAdditionalInfo}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="remarks" className="form-label">
            Endorser's Remarks
          </label>
          <textarea
            className="form-control"
            id="remarks"
            rows={3}
            name="EndorseRemarks"
            placeholder="Please state reason if request is rejected"
            value={endorseData.EndorseRemarks}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          Upload a file: <b>PDF Only!</b>
        </div>
        <div className="input-group">
          <input
            type="file"
            className="form-control"
            id="fileUpload"
            name="EndorseAttachment"
            aria-describedby="fileUpload"
            aria-label="fileUpload"
            onChange={handleChange}
          />
        </div>
        <div className="col-12 d-flex justify-content-center">
          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginRight: "1rem" }}
            onClick={() => {
              setEndorseData({ ...endorseData, Action: "endorse" });
            }}
          >
            Endorse Request
          </button>
          <button
            type="submit"
            className="btn btn-danger"
            style={{ marginLeft: "1rem" }}
            onClick={() => {
              setEndorseData({ ...endorseData, Action: "reject" });
            }}
          >
            Reject Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignEndorse;
