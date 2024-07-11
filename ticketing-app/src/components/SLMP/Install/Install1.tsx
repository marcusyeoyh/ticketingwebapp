import React, { useState, useEffect } from "react";
import { submitForm } from "../../API";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../UserContext";

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Install1: React.FC = () => {
  const { user } = useUser();
  const curDate = formatDate(new Date());
  const [formData, setFormData] = useState({
    ROID: user?.username || "",
    FullName: user?.full_name || "",
    DivisionProgram: "",
    Date: curDate || "",
    Outside: "",
    EndorserID: "",
    ApproverID: "",
    SoftwareAssignee: "",
    MachineCATNumber: "",
    MachineName: "",
    SoftwareName: "",
    VersionNumber: "",
    SoftwareInvenNumber: "",
    LicenseType: "",
    LicensingScheme: "",
    LicenseValidity: "",
    AdditionalInfo: "",
    Remarks: "",
    FileUpload: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.username) {
      setFormData((prevData) => ({
        ...prevData,
        ROID: user.username,
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files && files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await submitForm("/submitslmp/install/section1", formData);
      console.log("Form submitted successfully:", data["Request ID"]);
      navigate("/form-submitted", {
        state: { formid: data["Request ID"] },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="row g-3"
      style={{ margin: "0.5rem" }}
    >
      <div className="col-md-3">
        <label htmlFor="ROName" className="form-label">
          Name of RO:
        </label>
        <input
          className="form-control"
          id="ROName"
          name="FullName"
          value={formData.FullName}
          onChange={handleChange}
          disabled
        />
      </div>
      <div className="col-md-3">
        <label htmlFor="division-prog" className="form-label">
          Division / Programme: *
        </label>
        <input
          className="form-control"
          id="division-prog"
          name="DivisionProgram"
          value={formData.DivisionProgram}
          onChange={handleChange}
          required
        />
      </div>
      <div className="col-md-3">
        <label htmlFor="reqdate" className="form-label">
          Date of Request: *
        </label>
        <input
          type="date"
          className="form-control"
          id="reqdate"
          name="Date"
          value={formData.Date}
          onChange={handleChange}
          disabled
        />
      </div>
      <div className="col-md-3">
        <label htmlFor="selectOutside" className="form-label">
          License from outside Core Programme? *
        </label>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="Outside"
            id="isOutside"
            value="Yes"
            onChange={handleChange}
            required
          />
          <label className="form-check-label" htmlFor="isOutside">
            Yes
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="Outside"
            id="notOutside"
            value="No"
            onChange={handleChange}
            required
          />
          <label className="form-check-label" htmlFor="notOutside">
            No
          </label>
        </div>
      </div>
      <div className="col-md-6">
        <label htmlFor="EndorsingOfficer" className="form-label">
          Endorsing Officer (EO): *
        </label>
        <select
          id="EndorsingOfficer"
          className="form-select"
          name="EndorserID"
          value={formData.EndorserID}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select...
          </option>
          <option value="ericong">Eric Ong</option>
          <option value="EO2">EO2</option>
          <option value="Administrator">EO3</option>
        </select>
      </div>
      <div className="col-md-6">
        <label htmlFor="ApprovingOfficer" className="form-label">
          Approving Officer (AO): *
        </label>
        <select
          id="ApprovingOfficer"
          className="form-select"
          name="ApproverID"
          value={formData.ApproverID}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select...
          </option>
          <option value="AO1">AO1</option>
          <option value="AO2">AO2</option>
          <option value="Administrator">AO3</option>
        </select>
      </div>
      <div className="col-6">
        <label htmlFor="softwareAssignee" className="form-label">
          Assignee of software: *
        </label>
        <input
          type="text"
          className="form-control"
          id="softwareAssignee"
          name="SoftwareAssignee"
          value={formData.SoftwareAssignee}
          onChange={handleChange}
          required
        />
      </div>
      <div className="col-md-3">
        <label htmlFor="machineCATNumber" className="form-label">
          Machine CAT Number: *
        </label>
        <input
          className="form-control"
          id="machineCATNumber"
          name="MachineCATNumber"
          value={formData.MachineCATNumber}
          onChange={handleChange}
          required
        />
      </div>
      <div className="col-md-3">
        <label htmlFor="machineName" className="form-label">
          Machine Name: *
        </label>
        <input
          className="form-control"
          id="machineName"
          name="MachineName"
          value={formData.MachineName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="col-4">
        <label htmlFor="softwareName" className="form-label">
          Name of Software: *
        </label>
        <input
          type="text"
          className="form-control"
          id="softwareName"
          name="SoftwareName"
          value={formData.SoftwareName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="col-md-4">
        <label htmlFor="versionNumber" className="form-label">
          Version Number: *
        </label>
        <input
          type="text"
          className="form-control"
          id="versionNumber"
          name="VersionNumber"
          value={formData.VersionNumber}
          onChange={handleChange}
          required
        />
      </div>
      <div className="col-md-4">
        <label htmlFor="softwareInvenNum" className="form-label">
          Software Inventory Number (if any) *
        </label>
        <input
          type="text"
          className="form-control"
          id="softwareInvenNum"
          placeholder="NIL required if none"
          name="SoftwareInvenNumber"
          value={formData.SoftwareInvenNumber}
          onChange={handleChange}
          required
        />
      </div>
      <div className="col-md-4">
        <label htmlFor="lisenceType" className="form-label">
          Type of license: *
        </label>
        <select
          id="lisenceType"
          className="form-select"
          name="LicenseType"
          value={formData.LicenseType}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select...
          </option>
          <option value="PDL">PDL</option>
          <option value="LGPL">LGPL</option>
          <option value="Permissive">Permissive</option>
          <option value="CopyLeft">CopyLeft</option>
          <option value="Non-Commercial">Non-Commercial</option>
          <option value="Proprietary">Proprietary</option>
        </select>
      </div>
      <div className="col-md-4">
        <label htmlFor="licensingScheme" className="form-label">
          Licensing Scheme: *
        </label>
        <select
          id="licensingScheme"
          className="form-select"
          name="LicensingScheme"
          value={formData.LicensingScheme}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select...
          </option>
          <option value="Standalone">Standalone</option>
          <option value="Node-Locked">Node-Locked</option>
          <option value="Floating">Floating</option>
          <option value="Perpetual">Perpetual</option>
          <option value="Subscription">Subscription</option>
        </select>
      </div>
      <div className="col-md-4">
        <label htmlFor="licenseValidPeriod" className="form-label">
          Licensing Validity Period: *
        </label>
        <input
          type="text"
          className="form-control"
          id="licenseValidPeriod"
          placeholder="NIL required if none"
          name="LicenseValidity"
          value={formData.LicenseValidity}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="additionalInfo" className="form-label">
          Additional Info on Software License:
        </label>
        <textarea
          className="form-control"
          id="additionalInfo"
          rows={3}
          placeholder="e.g. software license number, specific terms of usage to highlight"
          name="AdditionalInfo"
          value={formData.AdditionalInfo}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="mb-3">
        <label htmlFor="remarks" className="form-label">
          Remarks
        </label>
        <textarea
          className="form-control"
          id="remarks"
          rows={3}
          name="Remarks"
          value={formData.Remarks}
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
          name="fileUpload"
          aria-describedby="inputGroupFileAddon04"
          aria-label="fileUpload"
          onChange={handleChange}
        />
      </div>
      <div className="col-12 d-flex justify-content-center">
        <button type="submit" className="btn btn-primary">
          Submit Form
        </button>
      </div>
    </form>
  );
};

export default Install1;
