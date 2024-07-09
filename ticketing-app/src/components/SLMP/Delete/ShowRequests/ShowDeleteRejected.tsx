import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetUsername } from "../../../../utils/GetUserInfo";
import { findRequests } from "../../../API";

type ShowDeleteRejectedProps = {
  onRejectCountChange: (count: number) => void;
};

type SLMPRejections = {
  RequestID: number;
  ROID: string;
  Endorsed: string;
  Date: string;
};

const ShowDeleteRejected: React.FC<ShowDeleteRejectedProps> = ({
  onRejectCountChange,
}) => {
  const navigate = useNavigate();
  const { username, loadingUsername, errorUsername } = GetUsername();
  const [data, setData] = useState<SLMPRejections[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  if (loadingUsername) {
    return <div>Loading username...</div>;
  }

  if (errorUsername) {
    return <div>Error: {errorUsername}</div>;
  }

  useEffect(() => {
    const findData = async () => {
      if (username) {
        try {
          const response = await findRequests(
            "/slmp/delete/find-rejections",
            username
          );
          setData(response);
          onRejectCountChange(response.length);
        } catch (error) {
          setError(error as Error);
        } finally {
          setLoading(false);
        }
      }
    };
    findData();
  }, [username, onRejectCountChange]);

  if (loading) {
    return <div>Loading data from database...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleClick = (id: number) => {
    navigate(`/amend-delete-request/${id}`);
  };
  return (
    <div style={{ margin: "1rem" }}>
      <h4>SLMP Delete Requests:</h4>
      {data && data.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Request ID</th>
              <th scope="col">ROID</th>
              <th scope="col">Endorse Status</th>
              <th scope="col">Date Requested</th>
              <th scope="col">Further Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((request, index) => (
              <tr key={index} style={{ verticalAlign: "middle" }}>
                <th scope="row">{request.RequestID}</th>
                <td>{request.ROID}</td>
                <td>{request.Endorsed}</td>
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
        <p>No pending requests.</p>
      )}
    </div>
  );
};

export default ShowDeleteRejected;
