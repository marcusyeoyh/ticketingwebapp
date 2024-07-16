import React, { useCallback, useEffect, useState } from "react";
import ShowSLMPRejected from "./SLMP/Install/ShowRequests/ShowSLMPRejected";
import ShowTransferRejected from "./SLMP/Transfer/ShowRequests/ShowTransferRejected";
import ShowDeleteRejected from "./SLMP/Delete/ShowRequests/ShowDeleteRejected";

// Component that shows requests pending the user’s amendments

// callback function to update total number of requests pending the user's amendments
type PendingRejectProps = {
  onRejectCountChange: (count: number) => void;
};

const PendingReject: React.FC<PendingRejectProps> = ({
  onRejectCountChange,
}) => {
  // state that stores number of install requests pending user's amendments
  const [installCount, setInstallCount] = useState(0);

  // state that stores number of transfer requests pending user's amendments
  const [transferCount, setTransferCount] = useState(0);

  // state that stores number of delete requests pending user's amendments
  const [deleteCount, setDeleteCount] = useState(0);

  // callback function that updates number of install requests pending user's amendments
  const handleInstallCountChange = useCallback((count: number) => {
    setInstallCount(count);
  }, []);

  // callback function that updates number of transfer requests pending user's amendments
  const handleTransferCountChange = useCallback((count: number) => {
    setTransferCount(count);
  }, []);

  // callback function that updates number of delete requests pending user's amendments
  const handleDeleteCountChange = useCallback((count: number) => {
    setDeleteCount(count);
  }, []);

  // hook that updates the total number of requests pending the user's amendments
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
