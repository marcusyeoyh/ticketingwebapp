import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetUsername } from "../../../../utils/GetUserInfo";
import { findRequests } from "../../../API";

// component that shows all install requests that are pending for the logged on user

// attributes of the pending requests that are shown on the table
type SLMPDelete = {
  RequestID: number;
  Endorsed: string;
  Date: string;
};

// prop that contains the callback function to update the number of pending delete requests
type ShowSLMPDeleteProps = {
  onPendingCountChange: (count: number) => void;
};

const ShowSLMPDelete: React.FC<ShowSLMPDeleteProps> = ({
  onPendingCountChange,
}) => {
  // allows for navigation to view more information of the request
  const navigate = useNavigate();

  // obtain username of user
  const { username, loadingUsername, errorUsername } = GetUsername();

  // state that contains the pending requests
  const [data, setData] = useState<SLMPDelete[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  if (loadingUsername) {
    return <div>Loading username...</div>;
  }
  if (errorUsername) {
    return <div>Error: {errorUsername}</div>;
  }

  // hook that fetches the pending delete requests and updates the count
  useEffect(() => {
    const fetchData = async () => {
      if (username) {
        try {
          const result = await findRequests(
            "/slmp/delete/find-pending",
            username
          );
          setData(result);
          onPendingCountChange(result.length);
        } catch (error) {
          setError(error as Error);
          onPendingCountChange(0);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [username, onPendingCountChange]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // handles redirection to view more information of the request
  const handleClick = (id: number) => {
    navigate(`/view-delete-request/${id}`);
  };

  return (
    <div style={{ margin: "1rem" }}>
      <h4>Your Pending SLMP Delete Requests:</h4>
      {data && data.length > 0 ? (
        <table className="table table-striped">
          <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: "52%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "10%" }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Request ID</th>
              <th scope="col">Endorsed Status</th>
              <th scope="col">Date Requested</th>
              <th scope="col">Further Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((request, index) => (
              <tr key={index} style={{ verticalAlign: "middle" }}>
                <th scope="row">{request.RequestID}</th>
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

export default ShowSLMPDelete;
