import React, { useEffect, useState } from "react";
import { findSec1Info } from "../../../API";

// Component that shows all information for section 3 for the request
// Does not show information if the request is still pending

// prop that contains the id of the request being viewed
type ShowTransferSection3Props = {
  id: string;
};

// data structure that stores all the information to be displayed
type Section3Data = {
  Approved: string;
  ApproveFullName: string;
  ApproveDivisionProgram: string;
  ApproveRemarks: string;
  ApproveDate: string;
  ApproverID: string;
};

const ShowTransferSection3: React.FC<ShowTransferSection3Props> = ({ id }) => {
  // state that stores all section 2 data to be displayed
  const [sec3Data, setSec3Data] = useState<Section3Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // hook to obtain all the information of a request given its id
  useEffect(() => {
    const findData = async () => {
      try {
        const data = await findSec1Info("/slmp/transfer/full-form", id);
        setSec3Data(data[0]);
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

  return (
    <div style={{ margin: "1rem" }}>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h5>
            Section 3: Approval of Request for transfer of software license
          </h5>
          {sec3Data?.Approved == "Pending" && (
            <div>Approver: {sec3Data.ApproverID}</div>
          )}
          <p>Approve Status: {sec3Data?.Approved}</p>
        </div>
      </div>

      {/* section will only show if the request has been endorsed*/}
      {sec3Data?.Approved != "Pending" && (
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
                  width: "33%",
                  padding: "10px",
                  borderTop: "1px solid black",
                  borderLeft: "1px solid black",
                }}
              >
                <b>Name of AO:</b>
                <div>{sec3Data?.ApproveFullName}</div>
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
                <div>{sec3Data?.ApproveDivisionProgram}</div>
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
                <b>Date of Approval:</b>
                <div>{sec3Data?.ApproveDate}</div>
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
                <div>{sec3Data?.ApproveRemarks}</div>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShowTransferSection3;
