import React, { useEffect, useState } from "react";
import { downloadFile, findSec1Info } from "../../../API";

type ShowTransferSection1Props = {
  id: string;
};

type SLMPTransferSec1 = {
  FullName: string;
  DivisionProgram: string;
  Date: string;
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
  FileLink: string;
};

const ShowTransferSection1: React.FC<ShowTransferSection1Props> = ({ id }) => {
  const [sec1Data, setSec1Data] = useState<SLMPTransferSec1 | null>(null);
  const [sec1Loading, setSec1Loading] = useState(true);
  const [sec1Error, setSec1Error] = useState<Error | null>(null);

  useEffect(() => {
    const findData = async () => {
      try {
        const response = await findSec1Info("/slmp/transfer/full-form", id);
        setSec1Data(response[0]);
      } catch (sec1Error) {
        setSec1Error(sec1Error as Error);
      } finally {
        setSec1Loading(false);
      }
    };
    findData();
  }, []);

  if (sec1Loading) {
    return <div>Loading Request Information...</div>;
  }
  if (sec1Error) {
    return <div>Error: {sec1Error.message}</div>;
  }

  const handleDownload = () => {
    if (sec1Data?.FileLink) {
      downloadFile(sec1Data?.FileLink);
    } else {
      console.error("File link is undefined");
    }
  };

  return (
    <div style={{ margin: "1rem" }}>
      <h4
        style={{
          textDecoration: "underline",
          margin: "1rem",
          textAlign: "center",
        }}
      >
        Software License Transfer Approval Form
      </h4>
      <div className="d-flex justify-content-between">
        <div>
          <h5>
            Section 1: Request for transfer of software license (To be filled up
            by Requesting Officer (RO))
          </h5>
          <p>Request ID: {id}</p>
        </div>
        {sec1Data?.FileLink && (
          <button
            className="btn btn-primary"
            style={{
              width: "100px",
              height: "50px",
              fontSize: "0.8rem",
              backgroundColor: "#274472",
              borderColor: "#274472",
            }}
            onClick={handleDownload}
          >
            Download PDF
          </button>
        )}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr style={{ display: "table", width: "100%", tableLayout: "fixed" }}>
            <td
              style={{
                width: "33%",
                padding: "10px",
                borderTop: "1px solid black",
                borderLeft: "1px solid black",
              }}
            >
              <b>Name of RO:</b>
              <div>{sec1Data?.FullName}</div>
            </td>
            <td
              style={{
                width: "33%",
                padding: "10px",
                borderTop: "1px solid black",
                borderLeft: "1px solid black",
              }}
            >
              <b>Division / Programme:</b>
              <div>{sec1Data?.DivisionProgram}</div>
            </td>
            <td
              style={{
                width: "34%",
                padding: "10px",
                borderTop: "1px solid black",
                borderLeft: "1px solid black",
                borderRight: "1px solid black",
              }}
            >
              <b>Date of Request:</b>
              <div>{sec1Data?.Date}</div>
            </td>
          </tr>
          <tr style={{ display: "table", width: "100%", tableLayout: "fixed" }}>
            <td
              style={{
                width: "33%",
                padding: "10px",
                borderTop: "1px solid black",
                borderLeft: "1px solid black",
              }}
            >
              <b>Current Assignee of software:</b>
              <div>{sec1Data?.CurrentAssignee}</div>
            </td>
            <td
              style={{
                width: "33%",
                padding: "10px",
                borderTop: "1px solid black",
                borderLeft: "1px solid black",
              }}
            >
              <b>Current Machine CAT Number:</b>
              <div>{sec1Data?.CurrentCATNumber}</div>
            </td>
            <td
              style={{
                width: "34%",
                padding: "10px",
                borderTop: "1px solid black",
                borderLeft: "1px solid black",
                borderRight: "1px solid black",
              }}
            >
              <b>Current Machine Name:</b>
              <div>{sec1Data?.CurrentMachineName}</div>
            </td>
          </tr>
          <tr style={{ display: "table", width: "100%", tableLayout: "fixed" }}>
            <td
              style={{
                width: "33%",
                padding: "10px",
                borderTop: "1px solid black",
                borderLeft: "1px solid black",
              }}
            >
              <b>New Assignee of software:</b>
              <div>{sec1Data?.NewAssignee}</div>
            </td>
            <td
              style={{
                width: "33%",
                padding: "10px",
                borderTop: "1px solid black",
                borderLeft: "1px solid black",
              }}
            >
              <b>New Machine CAT Number:</b>
              <div>{sec1Data?.NewCATNumber}</div>
            </td>
            <td
              style={{
                width: "34%",
                padding: "10px",
                borderTop: "1px solid black",
                borderLeft: "1px solid black",
                borderRight: "1px solid black",
              }}
            >
              <b>New Machine Name:</b>
              <div>{sec1Data?.NewMachineName}</div>
            </td>
          </tr>
          <tr style={{ display: "table", width: "100%", tableLayout: "fixed" }}>
            <td
              style={{
                width: "33%",
                padding: "10px",
                borderTop: "1px solid black",
                borderLeft: "1px solid black",
              }}
            >
              <b>Name of Software:</b>
              <div>{sec1Data?.SoftwareName}</div>
            </td>
            <td
              style={{
                width: "33%",
                padding: "10px",
                borderTop: "1px solid black",
                borderLeft: "1px solid black",
              }}
            >
              <b>Version Number:</b>
              <div>{sec1Data?.VersionNumber}</div>
            </td>
            <td
              style={{
                width: "34%",
                padding: "10px",
                borderTop: "1px solid black",
                borderLeft: "1px solid black",
                borderRight: "1px solid black",
              }}
            >
              <b>Software Inventory Number:</b>
              <div>{sec1Data?.SoftwareInvenNumber}</div>
            </td>
          </tr>
          <tr style={{ display: "table", width: "100%", tableLayout: "fixed" }}>
            <td
              style={{
                width: "33%",
                padding: "10px",
                borderTop: "1px solid black",
                borderLeft: "1px solid black",
              }}
            >
              <b>Type of License:</b>
              <div>{sec1Data?.LicenseType}</div>
            </td>
            <td
              style={{
                width: "33%",
                padding: "10px",
                borderTop: "1px solid black",
                borderLeft: "1px solid black",
              }}
            >
              <b>Licensing Scheme:</b>
              <div>{sec1Data?.LicensingScheme}</div>
            </td>
            <td
              style={{
                width: "34%",
                padding: "10px",
                borderTop: "1px solid black",
                borderLeft: "1px solid black",
                borderRight: "1px solid black",
              }}
            >
              <b>License Validity Period:</b>
              <div>{sec1Data?.LicenseValidity}</div>
            </td>
          </tr>
          <tr style={{ display: "table", width: "100%", tableLayout: "fixed" }}>
            <td
              style={{
                width: "100%",
                padding: "10px",
                borderTop: "1px solid black",
                borderLeft: "1px solid black",
                borderRight: "1px solid black",
              }}
            >
              <b>Additional Information:</b>
              <div>{sec1Data?.AdditionalInfo}</div>
            </td>
          </tr>
          <tr style={{ display: "table", width: "100%", tableLayout: "fixed" }}>
            <td
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid black",
              }}
            >
              <b>Remarks:</b>
              <div>{sec1Data?.Remarks}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ShowTransferSection1;
