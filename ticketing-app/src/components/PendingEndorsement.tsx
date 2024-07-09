import React, { useCallback, useEffect, useState } from "react";
import ShowSLMPEndorsements from "./ShowEndorsements/ShowSLMPEndorsements";
import ShowTransferEndorsements from "./SLMP/Transfer/ShowRequests/ShowTransferEndorsements";
import ShowDeleteEndorsements from "./SLMP/Delete/ShowRequests/ShowDeleteEndorsements";

type PendingEndorsementProps = {
  onEndorseCountChange: (count: number) => void;
};

const PendingEndorsement: React.FC<PendingEndorsementProps> = ({
  onEndorseCountChange,
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
