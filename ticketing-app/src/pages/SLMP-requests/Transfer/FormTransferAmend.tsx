import React, { useEffect, useState } from "react";
import NavBar from "../../../components/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import { findSec1Info, getUsers, submitForm } from "../../../components/API";
import ShowTransferSection1 from "../../../components/SLMP/Transfer/Section 1/ShowTransferSection1";
import ShowTransferSection2 from "../../../components/SLMP/Transfer/Section 2/ShowTransferSection2";
import ShowTransferSection3 from "../../../components/SLMP/Transfer/Section 3/ShowTransferSection3";
import ShowTransferSection4 from "../../../components/SLMP/Transfer/Section 4/ShowTransferSection4";

// Page contains form and input fields for section 1 of a SLMP Transfer request to allow for amendments to the request after being rejected
// Contains existing information for Section 1, 2, 3 and 4 if they are not pending

// datatype that stores old form information
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

// datatype for users that are part of endorsing officer, approving officer or regular users groups
type UserInfo = {
  full_name: string;
  username: string;
};

const FormTransferAmend = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<FormStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // state to store
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

  const [endorsingOfficers, setEndorsingOfficers] = useState<UserInfo[] | null>(
    null
  );
  const [eoLoading, setEOLoading] = useState(true);
  const [eoError, setEOError] = useState<Error | null>(null);
  const [eoSearchTerm, setEOSearchTerm] = useState("");
  const [filteredEO, setFilteredEO] = useState<UserInfo[]>([]);
  const [showEODropdown, setShowEODropdown] = useState(false);
  const [noEOAlert, setNoEOAlert] = useState(false);

  const [approvingOfficers, setApprovingOfficers] = useState<UserInfo[] | null>(
    null
  );
  const [aoLoading, setAOLoading] = useState(true);
  const [aoError, setAOError] = useState<Error | null>(null);
  const [aoSearchTerm, setAOSearchTerm] = useState("");
  const [filteredAO, setFilteredAO] = useState<UserInfo[]>([]);
  const [showAODropdown, setShowAODropdown] = useState(false);
  const [noAOAlert, setNoAOAlert] = useState(false);

  const [recipients, setRecipients] = useState<UserInfo[] | null>(null);
  const [rLoading, setRLoading] = useState(true);
  const [rError, setRError] = useState<Error | null>(null);
  const [searchRTerm, setSearchRTerm] = useState("");
  const [filteredR, setFilteredR] = useState<UserInfo[]>([]);
  const [showRDropdown, setShowRDropdown] = useState(false);
  const [noRAlert, setNoRAlert] = useState(false);

  // hook to obtain existing form information and update data state
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

  // hook to update new form data to reflect old form data
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

  // hook to set the new assignees, endorsing officers and approving officers to reflect what is in the current form
  useEffect(() => {
    if (newData) {
      setSearchRTerm(newData.NewAssignee);
      setEOSearchTerm(newData.EndorserID);
      setAOSearchTerm(newData.ApproverID);
    }
  }, [data]);

  // hooks to obtain arrays of users that can be new assignees, endorsing officers and approving officers
  useEffect(() => {
    const fetchEOData = async () => {
      try {
        const data = await getUsers("Endorsing Officers");
        setEndorsingOfficers(data);
      } catch (error) {
        setEOError(error as Error);
      } finally {
        setEOLoading(false);
      }
    };
    fetchEOData();
  }, []);

  useEffect(() => {
    const fetchAOData = async () => {
      try {
        const data = await getUsers("Approving Officers");
        setApprovingOfficers(data);
      } catch (error) {
        setAOError(error as Error);
      } finally {
        setAOLoading(false);
      }
    };
    fetchAOData();
  }, []);

  useEffect(() => {
    const fetchRData = async () => {
      try {
        const data = await getUsers("Remote Desktop Users");
        setRecipients(data);
      } catch (error) {
        setRError(error as Error);
      } finally {
        setRLoading(false);
      }
    };
    fetchRData();
  }, []);

  if (loading) {
    return <div>Loading Request Information...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (eoLoading) {
    return <div>Loading...</div>;
  }
  if (eoError) {
    return <div>Error {eoError.message}</div>;
  }
  if (aoLoading) {
    return <div>Loading...</div>;
  }
  if (aoError) {
    return <div>Error {aoError.message}</div>;
  }
  if (rLoading) {
    return <div>Loading...</div>;
  }
  if (rError) {
    return <div>Error {rError.message}</div>;
  }

  // handles changes to input fields and update the data state to reflect the latest change
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

  // handles submission of form, checking to make sure that all fields are filled before amending the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newData.ApproverID == "") {
      setNoAOAlert(true);
      return;
    }
    if (newData.EndorserID == "") {
      setNoEOAlert(true);
      return;
    }
    if (newData.NewAssignee == "") {
      setNoRAlert(true);
      return;
    }
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

  // handles search for endorsing, approving officer or new assignee
  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement>,
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
    officers: UserInfo[] | null,
    setFilteredOfficers: React.Dispatch<React.SetStateAction<UserInfo[]>>,
    field: "EndorserID" | "ApproverID" | "NewAssignee"
  ) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setFilteredOfficers([]);
    } else if (officers) {
      const filtered = officers.filter((officer) =>
        officer.full_name.toLowerCase().includes(value.toLowerCase())
      );
      if (filtered.length == 0) {
        setNewData((prevData) => ({
          ...prevData,
          [field]: "",
        }));
      }
      setFilteredOfficers(filtered);
    }
  };

  // handles selection of a option and sets the relevant data fields
  const handleSelect = (
    field: "EndorserID" | "ApproverID" | "NewAssignee",
    officer: UserInfo,
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
    setFilteredOfficers: React.Dispatch<React.SetStateAction<UserInfo[]>>,
    setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>,
    setAlert: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setNewData((prevData) => ({
      ...prevData,
      [field]: officer.username,
    }));
    setSearchTerm(officer.full_name);
    setFilteredOfficers([]);
    setShowDropdown(false);
    setAlert(false);
  };

  // handles situation when user clicks away from input field
  const clickAway = (
    setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 400);
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
            {noEOAlert && (
              <div style={{ color: "red" }}>
                A valid Endorsing Officer must be chosen!
              </div>
            )}
            <div className="position-relative">
              <input
                type="text"
                id="EndorsingOfficer"
                className="form-control"
                value={eoSearchTerm}
                onChange={(e) =>
                  handleSearch(
                    e,
                    setEOSearchTerm,
                    endorsingOfficers,
                    setFilteredEO,
                    "EndorserID"
                  )
                }
                onFocus={() => setShowEODropdown(true)}
                onBlur={(e) => clickAway(setShowEODropdown)}
                placeholder="Search for an Endorsing Officer"
                required
              />
              {showEODropdown && (
                <ul className="list-group position-absolute w-100 mt-1 z-1000">
                  {filteredEO &&
                    filteredEO.slice(0, 4).map((eo) => (
                      <li
                        key={eo.username}
                        className="list-group-item list-group-item-action"
                        onClick={() =>
                          handleSelect(
                            "EndorserID",
                            eo,
                            setEOSearchTerm,
                            setFilteredEO,
                            setShowEODropdown,
                            setNoEOAlert
                          )
                        }
                      >
                        {eo.full_name}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <label htmlFor="ApprovingOfficer" className="form-label">
              Approving Officer (AO): *
            </label>
            {noAOAlert && (
              <div style={{ color: "red" }}>
                A valid Approving Officer must be chosen!
              </div>
            )}
            <div className="position-relative">
              <input
                type="text"
                id="ApprovingOfficer"
                className="form-control"
                value={aoSearchTerm}
                onChange={(e) =>
                  handleSearch(
                    e,
                    setAOSearchTerm,
                    approvingOfficers,
                    setFilteredAO,
                    "ApproverID"
                  )
                }
                onFocus={() => setShowAODropdown(true)}
                onBlur={() => clickAway(setShowAODropdown)}
                placeholder="Search for an Approving Officer"
                required
              />
              {showAODropdown && (
                <ul className="list-group position-absolute w-100 mt-1 z-1000">
                  {filteredAO &&
                    filteredAO.slice(0, 4).map((ao) => (
                      <li
                        key={ao.username}
                        className="list-group-item list-group-item-action"
                        onClick={() =>
                          handleSelect(
                            "ApproverID",
                            ao,
                            setAOSearchTerm,
                            setFilteredAO,
                            setShowAODropdown,
                            setNoAOAlert
                          )
                        }
                      >
                        {ao.full_name}
                      </li>
                    ))}
                </ul>
              )}
            </div>
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
            {noRAlert && (
              <div style={{ color: "red" }}>
                A valid recipient must be chosen!
              </div>
            )}
            <div className="position-relative">
              <input
                type="text"
                id="newAssignee"
                className="form-control"
                value={searchRTerm}
                onChange={(e) =>
                  handleSearch(
                    e,
                    setSearchRTerm,
                    recipients,
                    setFilteredR,
                    "NewAssignee"
                  )
                }
                onFocus={() => setShowRDropdown(true)}
                onBlur={() => clickAway(setShowRDropdown)}
                placeholder="Search for an New Assignee"
                required
              />
              {showRDropdown && (
                <ul className="list-group position-absolute w-100 mt-1 z-1000">
                  {filteredR &&
                    filteredR.slice(0, 4).map((r) => (
                      <li
                        key={r.username}
                        className="list-group-item list-group-item-action"
                        onClick={() =>
                          handleSelect(
                            "NewAssignee",
                            r,
                            setSearchRTerm,
                            setFilteredR,
                            setShowRDropdown,
                            setNoRAlert
                          )
                        }
                      >
                        {r.full_name}
                      </li>
                    ))}
                </ul>
              )}
            </div>
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
