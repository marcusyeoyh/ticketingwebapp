import React, { useEffect, useState } from "react";
import NavBar from "../../../components/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import { findSec1Info, submitForm } from "../../../components/API";
import ShowTransferSection1 from "../../../components/SLMP/Transfer/Section 1/ShowTransferSection1";
import ShowTransferSection2 from "../../../components/SLMP/Transfer/Section 2/ShowTransferSection2";
import ShowTransferSection3 from "../../../components/SLMP/Transfer/Section 3/ShowTransferSection3";
import ShowTransferSection4 from "../../../components/SLMP/Transfer/Section 4/ShowTransferSection4";

type FormStatus = {
  ROID: string;
  FullName: string;
  DivisionProgram: string;
  Date: string;
  EndorserID: string;
  ApproverID: string;
  CurrentAssignee: string;
  CurrentCATNumber: string;
  CurrentMachineName: string;
  NewAssignee: string;
  NewCATNumber: string;
  NewMachineName: string;
  SoftwareName: string;
  VersionNumber: string;
  SoftwareInvenNumber: string;
  LicenseType: string;
  LicensingScheme: string;
  LicenseValidity: string;
  AdditionalInfo: string;
  Remarks: string;
  FilePath: string;
  Endorsed: string;
  Approved: string;
  Accepted: string;
};

const FormTransferAmend = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<FormStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [newData, setNewData] = useState({
    ROID: "",
    FullName: "",
    DivisionProgram: "",
    Date: "",
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
    id: "",
    FilePath: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await findSec1Info("/slmp/transfer/full-form", id);
          setData(response[0]);
        } catch (error) {
          setError(error as Error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data && id) {
      setNewData({
        ROID: data.ROID || "",
        FullName: data.FullName || "",
        DivisionProgram: data.DivisionProgram || "",
        Date: data.Date || "",
        EndorserID: data.EndorserID || "",
        ApproverID: data.ApproverID || "",
        CurrentAssignee: data.CurrentAssignee || "",
        CurrentCATNumber: data.CurrentCATNumber || "",
        CurrentMachineName: data.CurrentMachineName || "",
        NewAssignee: data.NewAssignee || "",
        NewCATNumber: data.NewCATNumber || "",
        NewMachineName: data.NewMachineName || "",
        SoftwareName: data.SoftwareName || "",
        VersionNumber: data.VersionNumber || "",
        SoftwareInvenNumber: data.SoftwareInvenNumber || "",
        LicenseType: data.LicenseType || "",
        LicensingScheme: data.LicensingScheme || "",
        LicenseValidity: data.LicenseValidity || "",
        AdditionalInfo: data.AdditionalInfo || "",
        Remarks: data.Remarks || "",
        FileUpload: null,
        id: id,
        FilePath: data.FilePath || "",
      });
    }
  }, [data]);

  if (loading) {
    return <div>Loading Request Information...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files && files.length > 0) {
      setNewData({ ...newData, [name]: files[0] });
    } else {
      setNewData({ ...newData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await submitForm("/submitslmp/transfer/amend", newData);
      console.log("Form amended successfully:", data["Request ID"]);
      navigate("/form-submitted", {
        state: { formid: data["Request ID"] },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (id) {
    return (
      <>
        <NavBar />
        <ShowTransferSection1 id={id} />
        {(data?.Endorsed == "Rejected" || data?.Endorsed == "Endorsed") && (
          <ShowTransferSection2 id={id} />
        )}
        {(data?.Approved == "Rejected" || data?.Approved == "Approved") && (
          <ShowTransferSection3 id={id} />
        )}
        {data?.Accepted == "Rejected" && <ShowTransferSection4 id={id} />}
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
              value={newData.FullName}
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
              value={newData.DivisionProgram}
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
              value={newData.Date}
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
              value={newData.EndorserID}
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
              value={newData.ApproverID}
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
              value={newData.CurrentAssignee}
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
              value={newData.CurrentCATNumber}
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
              value={newData.CurrentMachineName}
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
              value={newData.NewAssignee}
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
              value={newData.NewCATNumber}
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
              value={newData.NewMachineName}
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
              value={newData.SoftwareName}
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
              value={newData.VersionNumber}
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
              value={newData.SoftwareInvenNumber}
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
              value={newData.LicenseType}
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
              value={newData.LicensingScheme}
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
              value={newData.LicenseValidity}
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
              value={newData.AdditionalInfo}
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
              value={newData.Remarks}
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
              name="FileUpload"
              aria-describedby="fileUpload"
              aria-label="fileUpload"
              onChange={handleChange}
            />
          </div>
          <div className="col-12 d-flex justify-content-center">
            <button type="submit" className="btn btn-primary">
              Amend Form
            </button>
          </div>
        </form>
      </>
    );
  } else return <div>Error, no id detected!</div>;
};

export default FormTransferAmend;
