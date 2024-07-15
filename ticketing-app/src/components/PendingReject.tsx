import React, { useCallback, useEffect, useState } from "react";
import ShowSLMPRejected from "./SLMP/Install/ShowRequests/ShowSLMPRejected";
import ShowTransferRejected from "./SLMP/Transfer/ShowRequests/ShowTransferRejected";
import ShowDeleteRejected from "./SLMP/Delete/ShowRequests/ShowDeleteRejected";

type PendingRejectProps = {
  onRejectCountChange: (count: number) => void;
};

const PendingReject: React.FC<PendingRejectProps> = ({
  onRejectCountChange,
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
    onRejectCountChange(installCount + transferCount + deleteCount);
  }, [installCount, transferCount, deleteCount]);
  return (
    <>
      <ShowSLMPRejected onRejectCountChange={handleInstallCountChange} />
      <ShowTransferRejected onRejectCountChange={handleTransferCountChange} />
      <ShowDeleteRejected onRejectCountChange={handleDeleteCountChange} />
    </>
  );
};

export default PendingReject;
