import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../../UserContext";
import { getUsers, submitForm } from "../../../API";

// Component contains input fields for section 1 of a SLMP Transfer Request
// Responsible for sending input information to be saved in the Flask backend

// obtain current datatime information for form submission data
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// datatype to store information for users in endorsing officer, approving officer and new assignees groups
type UserInfo = {
  full_name: string;
  username: string;
};

const Transfer1 = () => {
  const { user } = useUser();
  const curDate = formatDate(new Date());

  // state to store input data
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

  // states to store endorsing officers and facilitate searching of endorsing officers
  const [endorsingOfficers, setEndorsingOfficers] = useState<UserInfo[] | null>(
    null
  );
  const [eoLoading, setEOLoading] = useState(true);
  const [eoError, setEOError] = useState<Error | null>(null);
  const [eoSearchTerm, setEOSearchTerm] = useState("");
  const [filteredEO, setFilteredEO] = useState<UserInfo[]>([]);
  const [showEODropdown, setShowEODropdown] = useState(false);
  const [noEOAlert, setNoEOAlert] = useState(false);

  // states to store approving officers and facilitate searching of approving officers
  const [approvingOfficers, setApprovingOfficers] = useState<UserInfo[] | null>(
    null
  );
  const [aoLoading, setAOLoading] = useState(true);
  const [aoError, setAOError] = useState<Error | null>(null);
  const [aoSearchTerm, setAOSearchTerm] = useState("");
  const [filteredAO, setFilteredAO] = useState<UserInfo[]>([]);
  const [showAODropdown, setShowAODropdown] = useState(false);
  const [noAOAlert, setNoAOAlert] = useState(false);

  // states to store all users in the AD and facilitate searching of new assignees
  const [recipients, setRecipients] = useState<UserInfo[] | null>(null);
  const [rLoading, setRLoading] = useState(true);
  const [rError, setRError] = useState<Error | null>(null);
  const [searchRTerm, setSearchRTerm] = useState("");
  const [filteredR, setFilteredR] = useState<UserInfo[]>([]);
  const [showRDropdown, setShowRDropdown] = useState(false);
  const [noRAlert, setNoRAlert] = useState(false);

  // obtain logged in user username and fullname to be used in form
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

  // hooks to find all eligible accounts that are endorsing officers, approving officers and new assignees
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

  // handle input to input fields in the form, saves the old state and changes the particular attribute that has been changed
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

  // handles submission of form, checks if necessary fields are filled in and then sends the data to the Flask backend
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
    if (formData.NewAssignee == "") {
      setNoRAlert(true);
      return;
    }
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

  // handles searching of user for either endorsing, approving officers or new assignees
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

  // handles selection of either endorsing, approving officer or new assignee after search
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

  // handles when user clicks away from search box
  const clickAway = (
    setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 400);
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
        {noRAlert && (
          <div style={{ color: "red" }}>A valid Recipient must be chosen!</div>
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
          aria-label="FileUpload"
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
