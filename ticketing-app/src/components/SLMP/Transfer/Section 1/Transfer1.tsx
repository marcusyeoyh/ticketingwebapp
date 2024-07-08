import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../../UserContext";
import { submitForm } from "../../../API";

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Transfer1 = () => {
  const { user } = useUser();
  const curDate = formatDate(new Date());
  const [formData, setFormData] = useState({
    ROID: user?.username || "",
    FullName: user?.full_name || "",
    DivisionProgram: "",
    Date: curDate || "",
    EndorserID: "",
    ApproverID: "",
    CurrentAssignee: "",
    CurrentCATNumber: "",
    CurrentMachineName: "",
    NewAssignee: "",
    NewCATNumber: "",
    NewMachineName: "",
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
      const data = await submitForm("/submitslmp/transfer/section1", formData);
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
      <div className="col-md-4">
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
      <div className="col-md-4">
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
      <div className="col-md-4">
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
      <div className="col-md-4">
        <label htmlFor="currentAssignee" className="form-label">
          Current Assignee of software: *
        </label>
        <input
          type="text"
          className="form-control"
          id="currentAssignee"
          name="CurrentAssignee"
          value={formData.CurrentAssignee}
          onChange={handleChange}
          required
        />
      </div>
      <div className="col-md-4">
        <label htmlFor="currentCATNumber" className="form-label">
          Current Machine CAT Number: *
        </label>
        <input
          className="form-control"
          id="currentCATNumber"
          name="CurrentCATNumber"
          value={formData.CurrentCATNumber}
          onChange={handleChange}
          required
        />
      </div>
      <div className="col-md-4">
        <label htmlFor="currentMachineName" className="form-label">
          Current Machine Name: *
        </label>
        <input
          className="form-control"
          id="currentMachineName"
          name="CurrentMachineName"
          value={formData.CurrentMachineName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="col-md-4">
        <label htmlFor="newAssignee" className="form-label">
          New Assignee of software: *
        </label>
        <select
          id="newAssignee"
          className="form-select"
          name="NewAssignee"
          value={formData.NewAssignee}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select...
          </option>
          <option value="test">test</option>
          <option value="ericong">Eric Ong</option>
          <option value="Administrator">Administrator</option>
        </select>
      </div>
      <div className="col-md-4">
        <label htmlFor="newCATNumber" className="form-label">
          New CAT Number: *
        </label>
        <input
          type="text"
          className="form-control"
          id="newCATNumber"
          name="NewCATNumber"
          value={formData.NewCATNumber}
          onChange={handleChange}
          required
        />
      </div>
      <div className="col-md-4">
        <label htmlFor="newMachineName" className="form-label">
          New Machine Name *
        </label>
        <input
          type="text"
          className="form-control"
          id="newMachineName"
          name="NewMachineName"
          value={formData.NewMachineName}
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
        <label htmlFor="softwareInvenNumber" className="form-label">
          Software Inventory Number *
        </label>
        <input
          type="text"
          className="form-control"
          id="softwareInvenNumber"
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

export default Transfer1;
