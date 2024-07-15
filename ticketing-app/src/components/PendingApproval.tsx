import React, { useCallback, useEffect, useState } from "react";
import ShowSLMPApprovals from "./SLMP/Install/ShowRequests/ShowSLMPApprovals";
import ShowTransferApprovals from "./SLMP/Transfer/ShowRequests/ShowTransferApprovals";

type PendingApprovalProp = {
  onApprovalCountChange: (count: number) => void;
};

const PendingApproval: React.FC<PendingApprovalProp> = ({
  onApprovalCountChange,
}) => {
  const [installCount, setInstallCount] = useState(0);
  const [transferCount, setTransferCount] = useState(0);
  const handleInstallCountChange = useCallback((count: number) => {
    setInstallCount(count);
  }, []);
  const handleTransferCountChange = useCallback((count: number) => {
    setTransferCount(count);
  }, []);

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
