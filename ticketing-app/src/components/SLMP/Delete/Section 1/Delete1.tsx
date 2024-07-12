import React, { useEffect, useState } from "react";
import { useUser } from "../../../../UserContext";
import { useNavigate } from "react-router-dom";
import { getUsers, submitForm } from "../../../API";

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

type UserInfo = {
  full_name: string;
  username: string;
};

const Delete1 = () => {
  const { user } = useUser();
  const curDate = formatDate(new Date());
  const [formData, setFormData] = useState({
    ROID: user?.username || "",
    FullName: user?.full_name || "",
    DivisionProgram: "",
    Date: curDate || "",
    RemovalReason: "",
    EndorserID: "",
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

  const [endorsingOfficers, setEndorsingOfficers] = useState<UserInfo[] | null>(
    null
  );
  const [eoLoading, setEOLoading] = useState(true);
  const [eoError, setEOError] = useState<Error | null>(null);
  const [eoSearchTerm, setEOSearchTerm] = useState("");
  const [showEODropdown, setShowEODropdown] = useState(false);
  const [filteredEO, setFilteredEO] = useState<UserInfo[]>([]);
  const [noEOAlert, setNoEOAlert] = useState(false);

  const navigate = useNavigate();

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

  if (eoLoading) {
    return <div>Loading...</div>;
  }
  if (eoError) {
    return <div>Error {eoError.message}</div>;
  }

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
    if (formData.EndorserID == "") {
      setNoEOAlert(true);
      return;
    }
    try {
      const data = await submitForm("/submitslmp/delete/section1", formData);
      console.log("Form submitted successfully:", data["Request ID"]);
      navigate("/form-submitted", {
        state: { formid: data["Request ID"] },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEOSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEOSearchTerm(value);

    if (value.trim() === "") {
      setFilteredEO([]);
    } else if (endorsingOfficers) {
      const filtered = endorsingOfficers.filter((eo) =>
        eo.full_name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredEO(filtered);
    }
    if (filteredEO.length == 0) {
      setFormData((prevData) => ({
        ...prevData,
        EndorserID: "",
      }));
    }
  };

  const handleEOSelect = (officer: UserInfo) => {
    setFormData((prevData) => ({
      ...prevData,
      EndorserID: officer.username,
    }));
    setEOSearchTerm(officer.full_name);
    setFilteredEO([]);
    setShowEODropdown(false);
    setNoEOAlert(false);
  };

  const EOClickAway = () => {
    setTimeout(() => setShowEODropdown(false), 200);
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
        <label htmlFor="removalReason" className="form-label">
          Reason for removal: *
        </label>
        <input
          type="text"
          className="form-control"
          id="removalReason"
          name="RemovalReason"
          value={formData.RemovalReason}
          onChange={handleChange}
          required
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
            onChange={handleEOSearch}
            onFocus={() => setShowEODropdown(true)}
            onBlur={() => EOClickAway()}
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
                    onClick={() => handleEOSelect(eo)}
                  >
                    {eo.full_name}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      <div className="col-md-4">
        <label htmlFor="assignee" className="form-label">
          Assignee of software: *
        </label>
        <input
          type="text"
          className="form-control"
          id="assignee"
          name="SoftwareAssignee"
          value={formData.SoftwareAssignee}
          onChange={handleChange}
          required
        />
      </div>
      <div className="col-md-4">
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
      <div className="col-md-4">
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

export default Delete1;
