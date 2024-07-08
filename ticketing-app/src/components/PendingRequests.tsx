import React, { useCallback, useEffect, useState } from "react";
import ShowSLMPInstall from "./ShowRequests/ShowSLMPInstall";
import ShowSLMPTransfer from "./SLMP/Transfer/ShowRequests/ShowSLMPTransfer";

type PendingRequestsProps = {
  onPendingCountChange: (count: number) => void;
};

const PendingRequests: React.FC<PendingRequestsProps> = ({
  onPendingCountChange,
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
    onPendingCountChange(installCount + transferCount);
  }, [installCount, transferCount]);

  return (
    <>
      <ShowSLMPInstall onPendingCountChange={handleInstallCountChange} />
      <ShowSLMPTransfer onPendingCountChange={handleTransferCountChange} />
    </>
  );
};

export default PendingRequests;
