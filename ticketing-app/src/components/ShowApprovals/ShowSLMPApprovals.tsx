import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetUsername } from "../../utils/GetUserInfo";
import { findApprovals } from "../API";

type SLMPApprovals = {
  RequestID: number;
  ROID: string;
  EndorserID: string;
  ApproverID: string;
  Date: string;
};

type ShowSLMPApprovalsProps = {
  onApprovalCountChange: (count: number) => void;
};

const ShowSLMPApprovals: React.FC<ShowSLMPApprovalsProps> = ({
  onApprovalCountChange,
}) => {
  const navigate = useNavigate();
  const { username, loadingUsername, errorUsername } = GetUsername();
  const [data, setData] = useState<SLMPApprovals[] | null>(null);
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
          const response = await findApprovals(
            "/slmp/install/find-approvals",
            username
          );
          setData(response);
          onApprovalCountChange(response.length);
        } catch (error) {
          setError(error as Error);
          onApprovalCountChange(0);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [username, onApprovalCountChange]);

  if (loading) {
    return <div>Loading data from database...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleClick = (id: number) => {
    navigate(`/approve-request/${id}`);
  };

  return (
    <div style={{ margin: "1rem" }}>
      <h4>Pending SLMP Install Requests:</h4>
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

export default ShowSLMPApprovals;
