import React, { useEffect, useState } from "react";
import { GetUsername } from "../../../../utils/GetUserInfo";
import { findEndorsements } from "../../../API";
import { useNavigate } from "react-router-dom";

// Component that shows all install requests that are pending the user’s endorsement

// data type that stores pending request information
type SLMPEndorsements = {
  RequestID: number;
  FullName: string;
  EndorserID: string;
  ApproverID: string;
  Date: string;
};

// callback function to update the number of requests pending
type ShowEndorsementsProps = {
  onEndorseCountChange: (count: number) => void;
};

const ShowSLMPEndorsements: React.FC<ShowEndorsementsProps> = ({
  onEndorseCountChange,
}) => {
  // allows for navigation to endorse the particular request
  const navigate = useNavigate();

  // obtains username of user
  const { username } = GetUsername();

  // states to store request information
  const [data, setData] = useState<SLMPEndorsements[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // hook to obtain all request information that is pending endorsement
  useEffect(() => {
    const fetchData = async () => {
      if (username) {
        try {
          const response = await findEndorsements(
            "/slmp/install/find-endorsements",
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
    navigate(`/endorse-request/${id}`);
  };

  return (
    <div style={{ margin: "1rem" }}>
      <h4>Pending SLMP Install Requests:</h4>
      {data && data.length > 0 ? (
        <table className="table table-striped">
          <colgroup>
            <col style={{ width: "15%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "28%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "15%" }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Request ID</th>
              <th scope="col">Requestor</th>
              <th scope="col">Endorser</th>
              <th scope="col">Approver</th>
              <th scope="col">Date Requested</th>
              <th scope="col">Further Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((request, index) => (
              <tr key={index} style={{ verticalAlign: "middle" }}>
                <th scope="row">{request.RequestID}</th>
                <td>{request.FullName}</td>
                <td>{request.EndorserID}</td>
                <td>{request.ApproverID}</td>
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

export default ShowSLMPEndorsements;
