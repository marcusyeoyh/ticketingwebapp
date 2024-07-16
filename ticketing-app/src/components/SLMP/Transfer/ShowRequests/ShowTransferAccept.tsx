import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetUsername } from "../../../../utils/GetUserInfo";
import { findRequests } from "../../../API";

// Component that shows requests pending the user’s acceptance

// callback function that updates the number of requests that is pending the user's acceptance
type ShowTransferAcceptProps = {
  onAcceptCountChange: (count: number) => void;
};

// datatype that stores the information needed to describe each pending request
type TransferAccept = {
  RequestID: number;
  ROID: string;
  EndorserID: string;
  ApproverID: string;
  NewAssignee: string;
  Date: string;
};

const ShowTransferAccept: React.FC<ShowTransferAcceptProps> = ({
  onAcceptCountChange,
}) => {
  // allows for redirection to the selected request to be accepted
  const navigate = useNavigate();

  // obtains username of logged in user
  const { username, loadingUsername, errorUsername } = GetUsername();

  // array that contains data of all requests pending the user's acceptance
  const [data, setData] = useState<TransferAccept[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  if (loadingUsername) {
    return <div>Loading username...</div>;
  }
  if (errorUsername) {
    return <div>Error: {errorUsername}</div>;
  }

  // hook that finds all requests that are pending the user's acceptance
  useEffect(() => {
    const fetchData = async () => {
      if (username) {
        try {
          const response = await findRequests(
            "/slmp/transfer/find-accept",
            username
          );
          setData(response);
          onAcceptCountChange(response.length);
        } catch (error) {
          setError(error as Error);
          onAcceptCountChange(0);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [username, onAcceptCountChange]);

  if (loading) {
    return <div>Loading data from database...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // handles redirect when a requests is needed to be accepted
  const handleClick = (id: number) => {
    navigate(`/approve-accept-request/${id}`);
  };

  return (
    <div style={{ margin: "1rem" }}>
      <h4>Pending SLMP Transfer Requests:</h4>
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
              <th scope="col">Endorser</th>
              <th scope="col">Approver</th>
              <th scope="col">Recepient</th>
              <th scope="col">Date Requested</th>
              <th scope="col">Further Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((request, index) => (
              <tr key={index} style={{ verticalAlign: "middle" }}>
                <th scope="row">{request.RequestID}</th>
                <td>{request.ROID}</td>
                <td>{request.EndorserID}</td>
                <td>{request.ApproverID}</td>
                <td>{request.NewAssignee}</td>
                <td>{request.Date}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleClick(request.RequestID)}
                  >
                    Approve/More Information
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

export default ShowTransferAccept;
