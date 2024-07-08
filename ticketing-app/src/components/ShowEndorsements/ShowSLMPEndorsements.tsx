import React, { useEffect, useState } from "react";
import { GetUsername } from "../../utils/GetUserInfo";
import { findEndorsements } from "../API";
import { useNavigate } from "react-router-dom";

type SLMPEndorsements = {
  RequestID: number;
  ROID: string;
  EndorserID: string;
  ApproverID: string;
  Date: string;
};

type ShowEndorsementsProps = {
  onEndorseCountChange: (count: number) => void;
};

const ShowSLMPEndorsements: React.FC<ShowEndorsementsProps> = ({
  onEndorseCountChange,
}) => {
  const navigate = useNavigate();
  const { username, loadingUsername, errorUsername } = GetUsername();
  const [data, setData] = useState<SLMPEndorsements[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  if (loadingUsername) {
    return <div>Loading username...</div>;
  }
  if (errorUsername) {
    return <div>Error: {errorUsername}</div>;
  }

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

  const handleClick = (id: number) => {
    navigate(`/endorse-request/${id}`);
  };

  return (
    <div style={{ margin: "1rem" }}>
      <h4>Pending SLMP Install Requests:</h4>
      {data && data.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Request ID</th>
              <th scope="col">ROID</th>
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
                <td>{request.ROID}</td>
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
