import React, { useEffect, useState } from "react";
import { findSec1Info } from "../../../API";

type ShowTransferSection4Props = {
  id: string;
};

type Section4Data = {
  Accepted: string;
  AcceptFullName: string;
  AcceptDivisionProgram: string;
  AcceptDate: string;
  AcceptRemarks: string;
};

const ShowTransferSection4: React.FC<ShowTransferSection4Props> = ({ id }) => {
  const [sec3Data, setSec3Data] = useState<Section4Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
            Section 4: Acceptance of Request for transfer of software license{" "}
          </h5>
          <p>Acceptance Status: {sec3Data?.Accepted}</p>
        </div>
      </div>
      {sec3Data?.Accepted != "Pending" && (
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
                <div>{sec3Data?.AcceptFullName}</div>
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
                <div>{sec3Data?.AcceptDivisionProgram}</div>
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
                <div>{sec3Data?.AcceptDate}</div>
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
                <div>{sec3Data?.AcceptRemarks}</div>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShowTransferSection4;
