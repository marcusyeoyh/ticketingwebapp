import React, { useCallback, useEffect, useState } from "react";
import ShowSLMPInstall from "./SLMP/Install/ShowRequests/ShowSLMPInstall";
import ShowSLMPTransfer from "./SLMP/Transfer/ShowRequests/ShowSLMPTransfer";
import ShowSLMPDelete from "./SLMP/Delete/ShowRequests/ShowSLMPDelete";

type PendingRequestsProps = {
  onPendingCountChange: (count: number) => void;
};

const PendingRequests: React.FC<PendingRequestsProps> = ({
  onPendingCountChange,
}) => {
  const [installCount, setInstallCount] = useState(0);
  const [transferCount, setTransferCount] = useState(0);
  const [deleteCount, setDeleteCount] = useState(0);

  const handleInstallCountChange = useCallback((count: number) => {
    setInstallCount(count);
  }, []);
  const handleTransferCountChange = useCallback((count: number) => {
    setTransferCount(count);
  }, []);
  const handleDeleteCountChange = useCallback((count: number) => {
    setDeleteCount(count);
  }, []);

  useEffect(() => {
    onPendingCountChange(installCount + transferCount + deleteCount);
  }, [installCount, transferCount, deleteCount]);

  return (
    <>
      <ShowSLMPInstall onPendingCountChange={handleInstallCountChange} />
      <ShowSLMPTransfer onPendingCountChange={handleTransferCountChange} />
      <ShowSLMPDelete onPendingCountChange={handleDeleteCountChange} />
    </>
  );
};

export default PendingRequests;
