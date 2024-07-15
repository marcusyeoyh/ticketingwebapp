import React, { useEffect, useState } from "react";
import NavBar from "../../../components/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import ShowSLMPInstallFullSection1 from "../../../components/SLMP/Install/Section 1/ShowSection1";
import { findSec1Info, getUsers, submitForm } from "../../../components/API";
import ShowSection2 from "../../../components/SLMP/Install/Section 2/ShowSection2";
import ShowSection3 from "../../../components/SLMP/Install/Section 3/ShowSection3";

type FormStatus = {
  ROID: string;
  FullName: string;
  DivisionProgram: string;
  Date: string;
  Outside: string;
  EndorserID: string;
  ApproverID: string;
  SoftwareAssignee: string;
  MachineCATNumber: string;
  MachineName: string;
  SoftwareName: string;
  VersionNumber: string;
  SoftwareInvenNumber: string;
  LicenseType: string;
  LicensingScheme: string;
  LicenseValidity: string;
  AdditionalInfo: string;
  FilePath: string;
  Remarks: string;
  Endorsed: string;
  Approved: string;
};

type UserInfo = {
  full_name: string;
  username: string;
};

const FormAmend = () => {
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

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await findSec1Info("/slmp/install/full-form", id);
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
        Outside: data.Outside || "",
        EndorserID: data.EndorserID || "",
        ApproverID: data.ApproverID || "",
        SoftwareAssignee: data.SoftwareAssignee || "",
        MachineCATNumber: data.MachineCATNumber || "",
        MachineName: data.MachineName || "",
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

  useEffect(() => {
    if (newData) {
      setEOSearchTerm(newData.EndorserID);
      setAOSearchTerm(newData.ApproverID);
    }
  }, [data]);

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
    if (newData.ApproverID == "") {
      setNoAOAlert(true);
      return;
    }
    if (newData.EndorserID == "") {
      setNoEOAlert(true);
      return;
    }
    try {
      const data = await submitForm("/submitslmp/install/amend", newData);
      console.log("Form amended successfully:", data["Request ID"]);
      navigate("/form-submitted", {
        state: { formid: data["Request ID"] },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

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
        <ShowSLMPInstallFullSection1 id={id} />
        {(data?.Endorsed == "Rejected" || data?.Endorsed == "Endorsed") && (
          <ShowSection2 id={id} />
        )}
        {data?.Approved == "Rejected" && <ShowSection3 id={id} />}
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
              value={newData.FullName}
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
              value={newData.DivisionProgram}
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
              value={newData.Date}
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
          <div className="col-6">
            <label htmlFor="softwareAssignee" className="form-label">
              Assignee of software: *
            </label>
            <input
              type="text"
              className="form-control"
              id="softwareAssignee"
              name="SoftwareAssignee"
              value={newData.SoftwareAssignee}
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
              value={newData.MachineCATNumber}
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
              value={newData.MachineName}
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
            <label htmlFor="softwareInvenNum" className="form-label">
              Software Inventory Number (if any) *
            </label>
            <input
              type="text"
              className="form-control"
              id="softwareInvenNum"
              placeholder="NIL required if none"
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
              <option value="">Select...</option>
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
              <option value="">Select...</option>
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
              aria-describedby="inputGroupFileAddon04"
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

export default FormAmend;
