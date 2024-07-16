import React, { useCallback, useEffect, useState } from "react";
import ShowSLMPApprovals from "./SLMP/Install/ShowRequests/ShowSLMPApprovals";
import ShowTransferApprovals from "./SLMP/Transfer/ShowRequests/ShowTransferApprovals";

// Component that shows requests pending the user’s approval

// callback function to update the total number of requests pending the user's approval
type PendingApprovalProp = {
  onApprovalCountChange: (count: number) => void;
};

const PendingApproval: React.FC<PendingApprovalProp> = ({
  onApprovalCountChange,
}) => {
  // state that stores the number of install requests that are pending the user's approval
  const [installCount, setInstallCount] = useState(0);

  // state that stores the number of transfer requests that are pending the user's approval
  const [transferCount, setTransferCount] = useState(0);

  // callback function that updates the number of install requests pending the user's approval
  const handleInstallCountChange = useCallback((count: number) => {
    setInstallCount(count);
  }, []);

  // callback function that updates the number of transfer requests pending the user's approval
  const handleTransferCountChange = useCallback((count: number) => {
    setTransferCount(count);
  }, []);

  // hook that updates the total number of requests pending the user's approval
  useEffect(() => {
    onApprovalCountChange(installCount + transferCount);
  }, [installCount, transferCount]);

  return (
    <div>
      <ShowSLMPApprovals onApprovalCountChange={handleInstallCountChange} />
      <ShowTransferApprovals
        onApprovalCountChange={handleTransferCountChange}
      />
    </div>
  );
};

export default PendingApproval;
