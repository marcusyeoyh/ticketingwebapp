import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { downloadCSV, findRequests } from "../../../API";

type AllReq = {
  RequestID: number;
  FullName: string;
  Date: string;
};

const ShowAdminTransfer = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AllReq[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await findRequests("/slmp/transfer/find-all", null);
        setData(response);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleClick = (id: number) => {
    navigate(`/view-transfer-request/${id}`);
  };

  const handleCSVClick = async () => {
    try {
      await downloadCSV("/slmp/transfer/downloadCSV", "transfer");
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  return (
    <div style={{ margin: "1rem" }}>
      <div className="d-flex justify-content-between">
        <h4>SLMP Transfer Records:</h4>
        <button className="btn btn-primary" onClick={() => handleCSVClick()}>
          Download CSV
        </button>
      </div>
      {data && data.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Request ID</th>
              <th scope="col">Requestor</th>
              <th scope="col">Date Requested</th>
              <th scope="col">View Request</th>
            </tr>
          </thead>
          <tbody>
            {data.map((request, index) => (
              <tr key={index} style={{ verticalAlign: "middle" }}>
                <th scope="row">{request.RequestID}</th>
                <td>{request.FullName}</td>
                <td>{request.Date}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleClick(request.RequestID)}
                  >
                    More Information
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No prior requests.</p>
      )}
    </div>
  );
};

export default ShowAdminTransfer;
