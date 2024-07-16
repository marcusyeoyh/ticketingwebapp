import React, { useCallback, useEffect, useState } from "react";
import ShowSLMPInstall from "./SLMP/Install/ShowRequests/ShowSLMPInstall";
import ShowSLMPTransfer from "./SLMP/Transfer/ShowRequests/ShowSLMPTransfer";
import ShowSLMPDelete from "./SLMP/Delete/ShowRequests/ShowSLMPDelete";

// component that shows all the user's pending requests and what stage they are in

type PendingRequestsProps = {
  onPendingCountChange: (count: number) => void;
};

const PendingRequests: React.FC<PendingRequestsProps> = ({
  onPendingCountChange,
}) => {
  // state that stores number of install requests that are pending
  const [installCount, setInstallCount] = useState(0);

  // state that stores number of transfer requests that are pending
  const [transferCount, setTransferCount] = useState(0);

  // state that stores number of delete requests that are pending
  const [deleteCount, setDeleteCount] = useState(0);

  // callback function to set the number of install requests that the user has pending
  const handleInstallCountChange = useCallback((count: number) => {
    setInstallCount(count);
  }, []);

  // callback function to set the number of transfer requests that the user has pending
  const handleTransferCountChange = useCallback((count: number) => {
    setTransferCount(count);
  }, []);

  // callback function to set the number of delete requests that the user has pending
  const handleDeleteCountChange = useCallback((count: number) => {
    setDeleteCount(count);
  }, []);

  // hook to update the total number of requests that the user has pending
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
