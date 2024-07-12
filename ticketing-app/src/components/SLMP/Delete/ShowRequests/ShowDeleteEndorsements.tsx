import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetUsername } from "../../../../utils/GetUserInfo";
import { findEndorsements } from "../../../API";

type ShowDeleteEndorsementsProps = {
  onEndorseCountChange: (count: number) => void;
};

type SLMPDeleteEndorsements = {
  RequestID: number;
  ROID: string;
  EndorserID: string;
  Date: string;
};

const ShowDeleteEndorsements: React.FC<ShowDeleteEndorsementsProps> = ({
  onEndorseCountChange,
}) => {
  const navigate = useNavigate();
  const { username, loadingUsername, errorUsername } = GetUsername();
  const [data, setData] = useState<SLMPDeleteEndorsements[] | null>(null);
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
            "/slmp/delete/find-endorsements",
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
    navigate(`/endorse-delete-request/${id}`);
  };

  return (
    <div style={{ margin: "1rem" }}>
      <h4>Pending SLMP Delete Requests:</h4>
      {data && data.length > 0 ? (
        <table className="table table-striped">
          <colgroup>
            <col style={{ width: "15%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "42%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "15%" }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Request ID</th>
              <th scope="col">ROID</th>
              <th scope="col">Endorser</th>
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

export default ShowDeleteEndorsements;
