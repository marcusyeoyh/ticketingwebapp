import { useState, useCallback } from "react";
import ProcessSelect from "./ProcessSelect";
import PendingRequests from "./PendingRequests";
import PendingEndorsement from "./PendingEndorsement";
import PendingApproval from "./PendingApproval";
import PendingReject from "./PendingReject";
import AllReq from "./AllReq";
import ShowTransferAccept from "./SLMP/Transfer/ShowRequests/ShowTransferAccept";

// Contains all actions possible for the logged in user regarding raising, checking and approving/endorsing/accepting/amending a request
// Allows users to see all requests that they have raised

const TaskBar = () => {
  // number of pending requests that the user has
  const [pendingReq, setPendingReq] = useState(0);

  // number of requests the user has that need to be endorsed
  const [endorseCount, setEndorseCount] = useState(0);

  // number of requests the user has that need to be approved
  const [approveCount, setApproveCount] = useState(0);

  // number of requests the user has that need to be accepted
  const [acceptCount, setAcceptCount] = useState(0);

  // number of requests the user has that need further action
  const [rejectCount, setRejectCount] = useState(0);

  // callback function that allows for the updating of number of pending requests
  const handlePendingReqChange = useCallback((count: number) => {
    setPendingReq(count);
  }, []);

  // callback function that allows for the updating of number of pending endorsements
  const handleEndorseCount = useCallback((count: number) => {
    setEndorseCount(count);
  }, []);

  // callback function that allows for the updating of number of pending approvals
  const handleApproveCount = useCallback((count: number) => {
    setApproveCount(count);
  }, []);

  // callback function that allows for the updating of number of pending accepts
  const handleAcceptCount = useCallback((count: number) => {
    setAcceptCount(count);
  }, []);

  // callback function that allows for the updating of number of pending ammendmends
  const handleRejectCount = useCallback((count: number) => {
    setRejectCount(count);
  }, []);

  return (
    <>
      <nav>
        <div className="nav nav-tabs" id="nav-tab" role="tablist">
          {/* allows users to raise a new request */}
          <button
            className="nav-link active"
            id="nav-process-select-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-process-select"
            type="button"
            role="tab"
            aria-controls="nav-process-select"
            aria-selected="true"
          >
            Make a new request
          </button>
          {pendingReq > 0 && (
            // if there are any pending requests by the user, they will be visible here
            <button
              className="nav-link"
              id="nav-pending-requests-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-pending-requests"
              type="button"
              role="tab"
              aria-controls="nav-pending-requests"
              aria-selected="false"
            >
              Your pending requests
              <span
                className="badge text-bg-danger rounded-pill"
                style={{ marginLeft: "0.5rem" }}
              >
                {pendingReq}
              </span>
            </button>
          )}
          {endorseCount > 0 && (
            // if there are any pending endorsements by the user, they will be visible here
            <button
              className="nav-link"
              id="nav-pending-endorsement-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-pending-endorsement"
              type="button"
              role="tab"
              aria-controls="nav-pending-endorsement"
              aria-selected="false"
            >
              Requests pending endorsement
              <span
                className="badge text-bg-danger rounded-pill"
                style={{ marginLeft: "0.5rem" }}
              >
                {endorseCount}
              </span>
            </button>
          )}
          {approveCount > 0 && (
            // if there are any pending approvals by the user, they will be visible here
            <button
              className="nav-link"
              id="nav-pending-approval-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-pending-approval"
              type="button"
              role="tab"
              aria-controls="nav-pending-approval"
              aria-selected="false"
              disabled={approveCount == 0}
            >
              Requests pending approval
              <span
                className="badge text-bg-danger rounded-pill"
                style={{ marginLeft: "0.5rem" }}
              >
                {approveCount}
              </span>
            </button>
          )}
          {acceptCount > 0 && (
            // if there are any pending accept by the user, they will be visible here
            <button
              className="nav-link"
              id="nav-pending-accept-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-pending-accept"
              type="button"
              role="tab"
              aria-controls="nav-pending-accept"
              aria-selected="false"
              disabled={acceptCount == 0}
            >
              Requests pending accept
              <span
                className="badge text-bg-danger rounded-pill"
                style={{ marginLeft: "0.5rem" }}
              >
                {acceptCount}
              </span>
            </button>
          )}
          {rejectCount > 0 && (
            // if there are any pending amends by the user, they will be visible here
            <button
              className="nav-link"
              id="nav-pending-reject-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-pending-reject"
              type="button"
              role="tab"
              aria-controls="nav-pending-reject"
              aria-selected="false"
              disabled={rejectCount == 0}
            >
              Requests requiring your attention:
              <span
                className="badge text-bg-danger rounded-pill"
                style={{ marginLeft: "0.5rem" }}
              >
                {rejectCount}
              </span>
            </button>
          )}

          {/* view entire request history of the user */}
          <button
            className="nav-link"
            id="nav-request-history-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-request-history"
            type="button"
            role="tab"
            aria-controls="nav-request-history"
            aria-selected="false"
          >
            Request history
          </button>
        </div>
      </nav>

      <div className="tab-content" id="nav-tabContent">
        <div
          className="tab-pane fade show active"
          id="nav-process-select"
          role="tabpanel"
          aria-labelledby="nav-process-select-tab"
        >
          <ProcessSelect />
        </div>
        <div
          className="tab-pane fade"
          id="nav-pending-requests"
          role="tabpanel"
          aria-labelledby="nav-pending-requests-tab"
        >
          <PendingRequests onPendingCountChange={handlePendingReqChange} />
        </div>
        <div
          className="tab-pane fade"
          id="nav-pending-endorsement"
          role="tabpanel"
          aria-labelledby="nav-pending-endorsement-tab"
        >
          <PendingEndorsement onEndorseCountChange={handleEndorseCount} />
        </div>
        <div
          className="tab-pane fade"
          id="nav-pending-approval"
          role="tabpanel"
          aria-labelledby="nav-pending-approval-tab"
        >
          <PendingApproval onApprovalCountChange={handleApproveCount} />
        </div>
        <div
          className="tab-pane fade"
          id="nav-pending-accept"
          role="tabpanel"
          aria-labelledby="nav-pending-accept-tab"
        >
          <ShowTransferAccept onAcceptCountChange={handleAcceptCount} />
        </div>
        <div
          className="tab-pane fade"
          id="nav-pending-reject"
          role="tabpanel"
          aria-labelledby="nav-pending-reject-tab"
        >
          <PendingReject onRejectCountChange={handleRejectCount} />
        </div>
        <div
          className="tab-pane fade"
          id="nav-request-history"
          role="tabpanel"
          aria-labelledby="nav-request-history-tab"
        >
          <AllReq />
        </div>
      </div>
    </>
  );
};

export default TaskBar;
