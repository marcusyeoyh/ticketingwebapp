import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetUsername } from "../../../../utils/GetUserInfo";
import { findApprovals } from "../../../API";

// Component that shows all transfer requests that are pending the user’s approval

// data type that stores information regarding pending approval request
type TransferApprovals = {
  RequestID: number;
  ROID: string;
  EndorserID: string;
  ApproverID: string;
  NewAssignee: string;
  Date: string;
};

// callback function that updates the number of approval requests
type ShowTransferApprovalsProps = {
  onApprovalCountChange: (count: number) => void;
};

const ShowTransferApprovals: React.FC<ShowTransferApprovalsProps> = ({
  onApprovalCountChange,
}) => {
  // allows for navigation to view the full request to be approved
  const navigate = useNavigate();

  // loads the username of the logged in user
  const { username, loadingUsername, errorUsername } = GetUsername();

  // state that stores all the pending requests
  const [data, setData] = useState<TransferApprovals[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  if (loadingUsername) {
    return <div>Loading username...</div>;
  }
  if (errorUsername) {
    return <div>Error: {errorUsername}</div>;
  }

  // hook that finds all the pending approval requests
  useEffect(() => {
    const fetchData = async () => {
      if (username) {
        try {
          const response = await findApprovals(
            "/slmp/transfer/find-approvals",
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

  // handles the approval of a request
  const handleClick = (id: number) => {
    navigate(`/approve-transfer-request/${id}`);
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

export default ShowTransferApprovals;
