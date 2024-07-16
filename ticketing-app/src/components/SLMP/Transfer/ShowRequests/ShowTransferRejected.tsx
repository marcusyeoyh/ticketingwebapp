import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetUsername } from "../../../../utils/GetUserInfo";
import { findRequests } from "../../../API";

// component that shows all the transfer requests that require the user's amendments

// callback function that updates the number of requests
type ShowTransferRejectedProps = {
  onRejectCountChange: (count: number) => void;
};

// datatype that stores the information needed for each request
type SLMPRejections = {
  RequestID: number;
  ROID: string;
  Endorsed: string;
  Approved: string;
  Accepted: string;
  Date: string;
};

const ShowTransferRejected: React.FC<ShowTransferRejectedProps> = ({
  onRejectCountChange,
}) => {
  // allows for redirection to page to allow user to amend request
  const navigate = useNavigate();

  // obtain user's username
  const { username, loadingUsername, errorUsername } = GetUsername();

  // array of requests that requires user's amendments
  const [data, setData] = useState<SLMPRejections[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  if (loadingUsername) {
    return <div>Loading username...</div>;
  }

  if (errorUsername) {
    return <div>Error: {errorUsername}</div>;
  }

  // hook that finds all transfer requests that requires user's amendments
  useEffect(() => {
    const findData = async () => {
      if (username) {
        try {
          const response = await findRequests(
            "/slmp/transfer/find-rejections",
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

  // handles redirect when a particular request is selected
  const handleClick = (id: number) => {
    navigate(`/amend-transfer-request/${id}`);
  };
  return (
    <div style={{ margin: "1rem" }}>
      <h4>SLMP Transfer Requests:</h4>
      {data && data.length > 0 ? (
        <table className="table table-striped">
          <colgroup>
            <col style={{ width: "15%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "15%" }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Request ID</th>
              <th scope="col">ROID</th>
              <th scope="col">Endorse Status</th>
              <th scope="col">Approve Status</th>
              <th scope="col">Accept Status</th>
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
                <td>{request.Approved}</td>
                <td>{request.Accepted}</td>
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

export default ShowTransferRejected;
