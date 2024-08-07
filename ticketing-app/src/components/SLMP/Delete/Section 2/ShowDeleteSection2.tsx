import React, { useEffect, useState } from "react";
import { downloadFile, findSec1Info } from "../../../API";

// Component that shows all information for section 2 for the request
// Does not show information if the request is still pending

// datatype that stores id of request to be deleted
type ShowDeleteSection2Props = {
  id: string;
};

// datatype that stores all form information to be displayed
type Section2Data = {
  Endorsed: string;
  EndorseFullName: string;
  EndorseDate: string;
  EndorseDivisionProgram: string;
  EndorseVerification: string;
  EndorseSupported: string;
  EndorseUninstalled: string;
  EndorseTracking: string;
  EndorseAdditionalInfo: string;
  EndorseRemarks: string;
  EndorseAttachment: string;
  EndorserID: string;
};

const ShowDeleteSection2: React.FC<ShowDeleteSection2Props> = ({ id }) => {
  const [sec2Data, setSec2Data] = useState<Section2Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // hook to obtain all section 2 information to be displayed
  useEffect(() => {
    const findData = async () => {
      try {
        const data = await findSec1Info("/slmp/delete/full-form", id);
        setSec2Data(data[0]);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    findData();
  }, []);

  if (loading) {
    return <div>Loading Section 2 Data...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // handles downloading of attached file
  const handleDownload = () => {
    if (sec2Data?.EndorseAttachment) {
      downloadFile(sec2Data?.EndorseAttachment);
    } else {
      console.error("File link is undefined");
    }
  };

  return (
    <div style={{ margin: "1rem" }}>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h5>
            Section 2: Verification of Request for software license removal
          </h5>
          {sec2Data?.Endorsed == "Pending" && (
            <div>Endorser: {sec2Data.EndorserID}</div>
          )}
          <p>Endorse Status: {sec2Data?.Endorsed}</p>
        </div>

        {/* download button if there exists an attached file */}
        {sec2Data?.EndorseAttachment && sec2Data?.Endorsed != "Pending" && (
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
      {sec2Data?.Endorsed != "Pending" && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
          }}
        >
          <tbody>
            <tr
              style={{ display: "table", width: "100%", tableLayout: "fixed" }}
            >
              <td
                style={{
                  width: "25%",
                  padding: "10px",
                  borderTop: "1px solid black",
                  borderLeft: "1px solid black",
                }}
              >
                <b>Name of SA:</b>
                <div>{sec2Data?.EndorseFullName}</div>
              </td>
              <td
                style={{
                  width: "25%",
                  padding: "10px",
                  borderTop: "1px solid black",
                  borderLeft: "1px solid black",
                }}
              >
                <b>Division / Programme:</b>
                <div>{sec2Data?.EndorseDivisionProgram}</div>
              </td>
              <td
                style={{
                  width: "25%",
                  padding: "10px",
                  borderTop: "1px solid black",
                  borderLeft: "1px solid black",
                }}
              >
                <b>Date of Endorsement:</b>
                <div>{sec2Data?.EndorseDate}</div>
              </td>
              <td
                style={{
                  width: "25%",
                  padding: "10px",
                  borderTop: "1px solid black",
                  borderLeft: "1px solid black",
                  borderRight: "1px solid black",
                }}
              >
                <b>Verification of Section 1 complete?</b>
                <div>{sec2Data?.EndorseVerification}</div>
              </td>
            </tr>
            <tr
              style={{ display: "table", width: "100%", tableLayout: "fixed" }}
            >
              <td
                style={{
                  width: "33%",
                  padding: "10px",
                  borderTop: "1px solid black",
                  borderLeft: "1px solid black",
                }}
              >
                <b>Request Supported?</b>
                <div>{sec2Data?.EndorseSupported}</div>
              </td>
              <td
                style={{
                  width: "33%",
                  padding: "10px",
                  borderTop: "1px solid black",
                  borderLeft: "1px solid black",
                }}
              >
                <b>Software Uninstalled?</b>
                <div>{sec2Data?.EndorseUninstalled}</div>
              </td>
              <td
                style={{
                  width: "34%",
                  padding: "10px",
                  borderTop: "1px solid black",
                  borderLeft: "1px solid black",
                }}
              >
                <b>Tracking Sheet Updated?</b>
                <div>{sec2Data?.EndorseTracking}</div>
              </td>
            </tr>

            <tr
              style={{ display: "table", width: "100%", tableLayout: "fixed" }}
            >
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
                <div>{sec2Data?.EndorseAdditionalInfo}</div>
              </td>
            </tr>
            <tr
              style={{ display: "table", width: "100%", tableLayout: "fixed" }}
            >
              <td
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid black",
                }}
              >
                <b>Remarks:</b>
                <div>{sec2Data?.EndorseRemarks}</div>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShowDeleteSection2;
