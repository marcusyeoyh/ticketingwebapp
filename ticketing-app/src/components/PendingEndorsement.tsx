import React, { useCallback, useEffect, useState } from "react";
import ShowSLMPEndorsements from "./SLMP/Install/ShowRequests/ShowSLMPEndorsements";
import ShowTransferEndorsements from "./SLMP/Transfer/ShowRequests/ShowTransferEndorsements";
import ShowDeleteEndorsements from "./SLMP/Delete/ShowRequests/ShowDeleteEndorsements";

// Component that shows requests pending the user’s endorsement

// callback function to update count of requests pending endorsement
type PendingEndorsementProps = {
  onEndorseCountChange: (count: number) => void;
};

const PendingEndorsement: React.FC<PendingEndorsementProps> = ({
  onEndorseCountChange,
}) => {
  // state to track number of install requests pending endoresement
  const [installCount, setInstallCount] = useState(0);

  // state to track number of transfer requests pending endoresement
  const [transferCount, setTransferCount] = useState(0);

  // state to track number of delete requests pending endoresement
  const [deleteCount, setDeleteCount] = useState(0);

  // callback function to update the number of install requests pending endorsement
  const handleInstallCountChange = useCallback((count: number) => {
    setInstallCount(count);
  }, []);

  // callback function to update the number of transfer requests pending endorsement
  const handleTransferCountChange = useCallback((count: number) => {
    setTransferCount(count);
  }, []);

  // callback function to update the number of delete requests pending endorsement
  const handleDeleteCountChange = useCallback((count: number) => {
    setDeleteCount(count);
  }, []);

  // hook to update the total number of requests that are pending endorsement
  useEffect(() => {
    onEndorseCountChange(installCount + transferCount + deleteCount);
  }, [installCount, transferCount, deleteCount]);

  return (
    <>
      <ShowSLMPEndorsements onEndorseCountChange={handleInstallCountChange} />
      <ShowTransferEndorsements
        onEndorseCountChange={handleTransferCountChange}
      />
      <ShowDeleteEndorsements onEndorseCountChange={handleDeleteCountChange} />
    </>
  );
};

export default PendingEndorsement;
