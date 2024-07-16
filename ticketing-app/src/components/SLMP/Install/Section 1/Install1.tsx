import React, { useState, useEffect } from "react";
import { getUsers, submitForm } from "../../../API";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../../UserContext";

// Component contains the form and fields for section 1 of the install request

// returns date string to be used if an attachment is added
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// stores user information which is used to autofill form for EndorserID, ApproverID
type UserInfo = {
  full_name: string;
  username: string;
};

const Install1: React.FC = () => {
  const { user } = useUser();
  const curDate = formatDate(new Date());

  // states to handle all existing endorsing officer information and faciliates the searching of desired endorsing officer.
  const [endorsingOfficers, setEndorsingOfficers] = useState<UserInfo[] | null>(
    null
  );
  const [eoLoading, setEOLoading] = useState(true);
  const [eoError, setEOError] = useState<Error | null>(null);
  const [eoSearchTerm, setEOSearchTerm] = useState("");
  const [filteredEO, setFilteredEO] = useState<UserInfo[]>([]);
  const [showEODropdown, setShowEODropdown] = useState(false);
  const [noEOAlert, setNoEOAlert] = useState(false);

  // states to handle all existing approving officer information and faciliates the searching of desired approving officer.
  const [approvingOfficers, setApprovingOfficers] = useState<UserInfo[] | null>(
    null
  );
  const [aoLoading, setAOLoading] = useState(true);
  const [aoError, setAOError] = useState<Error | null>(null);
  const [aoSearchTerm, setAOSearchTerm] = useState("");
  const [filteredAO, setFilteredAO] = useState<UserInfo[]>([]);
  const [showAODropdown, setShowAODropdown] = useState(false);
  const [noAOAlert, setNoAOAlert] = useState(false);

  // stores all variables for the form
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

  // obtains user username and full name to automatically update fields
  useEffect(() => {
    if (user?.username) {
      setFormData((prevData) => ({
        ...prevData,
        ROID: user.username,
      }));
    }
    if (user?.full_name) {
      setFormData((prevData) => ({
        ...prevData,
        FullName: user.full_name,
      }));
    }
  }, [user]);

  // obtain list of all endorsing officers
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

  // obtain list of all approving officers
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

  // handle change in a particular form intput field. the existing state for the formdata is copied over and the changed field is upadted
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

  // handles the submission of the form, ensuring that all fields are filled up correctly before the API is called
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.ApproverID == "") {
      setNoAOAlert(true);
      return;
    }
    if (formData.EndorserID == "") {
      setNoEOAlert(true);
      return;
    }
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

  // handles the searching functionality for endorsing officer, approving officer and new assignee
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
        setFormData((prevData) => ({
          ...prevData,
          [field]: "",
        }));
      }
      setFilteredOfficers(filtered);
    }
  };

  // handles the selecting of a search from handleSearch
  const handleSelect = (
    field: "EndorserID" | "ApproverID" | "NewAssignee",
    officer: UserInfo,
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
    setFilteredOfficers: React.Dispatch<React.SetStateAction<UserInfo[]>>,
    setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>,
    setAlert: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: officer.username,
    }));
    setSearchTerm(officer.full_name);
    setFilteredOfficers([]);
    setShowDropdown(false);
    setAlert(false);
  };

  // handles the event that the user clicks away from the search field
  const clickAway = (
    setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 400);
  };

  return (
    <>
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
              onBlur={() => clickAway(setShowEODropdown)}
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
    </>
  );
};

export default Install1;
