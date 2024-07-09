import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetUsername } from "../../../../utils/GetUserInfo";
import { findRequests } from "../../../API";

type ShowTransferAcceptProps = {
  onAcceptCountChange: (count: number) => void;
};

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
  const navigate = useNavigate();
  const { username, loadingUsername, errorUsername } = GetUsername();
  const [data, setData] = useState<TransferAccept[] | null>(null);
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

  const handleClick = (id: number) => {
    navigate(`/approve-accept-request/${id}`);
  };

  return (
    <div style={{ margin: "1rem" }}>
      <h4>Pending SLMP Transfer Requests:</h4>
      {data && data.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col" style={{ width: "200px" }}>
                Request ID
              </th>
              <th scope="col" style={{ width: "200px" }}>
                ROID
              </th>
              <th scope="col" style={{ width: "200px" }}>
                Endorser
              </th>
              <th scope="col" style={{ width: "200px" }}>
                Approver
              </th>
              <th scope="col" style={{ width: "200px" }}>
                Recepient
              </th>
              <th scope="col" style={{ width: "200px" }}>
                Date Requested
              </th>
              <th scope="col" style={{ width: "200px" }}>
                Further Actions
              </th>
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
