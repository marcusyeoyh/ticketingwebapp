import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { downloadCSV, findRequests } from "../../../API";
import "./ShowAdminInstall.css";

type AllReq = {
  RequestID: number;
  FullName: string;
  Endorsed: string;
  Approved: string;
  Date: string;
};

const ShowAdminInstall = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AllReq[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [deletedItems, setDeletedItems] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await findRequests("/slmp/install/find-all", null);
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
    navigate(`/view-request/${id}`);
  };

  const handleCSVClick = async () => {
    try {
      await downloadCSV("/slmp/install/downloadCSV", "install");
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  const deleteClick = async (id: number) => {
    try {
      // await deleteReq("/slmp/install/deleteReq", id);
      setDeletedItems((prev) => [...prev, id]);
      setTimeout(() => {
        setData((prev) =>
          prev ? prev.filter((item) => item.RequestID !== id) : null
        );
      }, 500);
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  return (
    <div style={{ margin: "1rem" }}>
      <div className="d-flex justify-content-between">
        <h4>SLMP Install Records:</h4>
        {data && data.length > 0 && (
          <button className="btn btn-primary" onClick={() => handleCSVClick()}>
            Download CSV
          </button>
        )}
      </div>

      {data && data.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Request ID</th>
              <th scope="col">Requestor</th>
              <th scope="col">Date Requested</th>
              <th scope="col">View Request</th>
              <th scope="col">Delete Request</th>
            </tr>
          </thead>
          <tbody>
            {data.map((request) => (
              <tr
                key={request.RequestID}
                style={{ verticalAlign: "middle" }}
                className={`table-row ${
                  deletedItems.includes(request.RequestID) ? "fade-out" : ""
                }`}
              >
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
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteClick(request.RequestID)}
                  >
                    Delete Request
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

export default ShowAdminInstall;
