import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetUsername } from "../../../../utils/GetUserInfo";
import { findEndorsements } from "../../../API";

// Component that shows all transfer requests that are pending the user’s endorsement

// data type that stores pending request information
type SLMPTransferEndorsements = {
  RequestID: number;
  ROID: string;
  EndorserID: string;
  ApproverID: string;
  NewAssignee: string;
  Date: string;
};

// callback function to update the number of requests pending
type ShowTransferEndorsementsProps = {
  onEndorseCountChange: (count: number) => void;
};

const ShowTransferEndorsements: React.FC<ShowTransferEndorsementsProps> = ({
  onEndorseCountChange,
}) => {
  // allows for navigation to endorse the particular request
  const navigate = useNavigate();

  // obtains username of user
  const { username, loadingUsername, errorUsername } = GetUsername();

  // states to store request information
  const [data, setData] = useState<SLMPTransferEndorsements[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  if (loadingUsername) {
    return <div>Loading username...</div>;
  }
  if (errorUsername) {
    return <div>Error: {errorUsername}</div>;
  }

  // hook to obtain all request information that is pending endorsement
  useEffect(() => {
    const fetchData = async () => {
      if (username) {
        try {
          const response = await findEndorsements(
            "/slmp/transfer/find-endorsements",
            username
          );
          setData(response);
          onEndorseCountChange(response.length);
        } catch (error) {
          setError(error as Error);
          onEndorseCountChange(0);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [username, onEndorseCountChange]);

  if (loading) {
    return <div>Loading data from database...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // handles click to endorse request
  const handleClick = (id: number) => {
    navigate(`/endorse-transfer-request/${id}`);
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
              <th scope="col">New Assignee</th>
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
                    Endorse/More Information
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

export default ShowTransferEndorsements;
