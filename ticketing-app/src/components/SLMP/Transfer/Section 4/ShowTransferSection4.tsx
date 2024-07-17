import React, { useEffect, useState } from "react";
import { findSec1Info } from "../../../API";

// Component that shows all information for section 4 for the request
// Does not show information if the request is still pending

// prop that contains the id of the request being viewed
type ShowTransferSection4Props = {
  id: string;
};

// data structure that stores all the information to be displayed
type Section4Data = {
  Accepted: string;
  AcceptFullName: string;
  AcceptDivisionProgram: string;
  AcceptDate: string;
  AcceptRemarks: string;
  NewAssignee: string;
};

const ShowTransferSection4: React.FC<ShowTransferSection4Props> = ({ id }) => {
  // state that stores all section 4 data to be displayed
  const [sec4Data, setSec4Data] = useState<Section4Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // hook to obtain all the information of a request given its id
  useEffect(() => {
    const findData = async () => {
      try {
        const data = await findSec1Info("/slmp/transfer/full-form", id);
        setSec4Data(data[0]);
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
            Section 4: Acceptance of Request for transfer of software license{" "}
          </h5>
          {sec4Data?.Accepted == "Pending" && (
            <div>New Assignee: {sec4Data.NewAssignee}</div>
          )}
          <p>Acceptance Status: {sec4Data?.Accepted}</p>
        </div>
      </div>

      {/* section will only show if the request has been endorsed*/}
      {sec4Data?.Accepted != "Pending" && (
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
                <div>{sec4Data?.AcceptFullName}</div>
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
                <div>{sec4Data?.AcceptDivisionProgram}</div>
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
                <div>{sec4Data?.AcceptDate}</div>
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
                <div>{sec4Data?.AcceptRemarks}</div>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShowTransferSection4;
