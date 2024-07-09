import React, { useEffect, useState } from "react";
import { findSec1Info } from "../../../API";

type Section3Data = {
  Approved: string;
  ApproveFullName: string;
  ApproveDivisionProgram: string;
  ApproveRemarks: string;
  ApproveDate: string;
};

type ShowSection3Props = {
  id: string;
};

const ShowSection3: React.FC<ShowSection3Props> = ({ id }) => {
  const [sec3Data, setSec3Data] = useState<Section3Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const findData = async () => {
      try {
        const data = await findSec1Info("/slmp/install/full-form", id);
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
          <h5>Section 3: Approval of Request for usage of software license</h5>
          <p>Approve Status: {sec3Data?.Approved}</p>
        </div>
      </div>
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

export default ShowSection3;
