import React, { useCallback, useEffect, useState } from "react";
import ShowSLMPEndorsements from "./ShowEndorsements/ShowSLMPEndorsements";
import ShowTransferEndorsements from "./SLMP/Transfer/ShowRequests/ShowTransferEndorsements";

type PendingEndorsementProps = {
  onEndorseCountChange: (count: number) => void;
};

const PendingEndorsement: React.FC<PendingEndorsementProps> = ({
  onEndorseCountChange,
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
    onEndorseCountChange(installCount + transferCount);
  }, [installCount, transferCount]);

  return (
    <>
      <ShowSLMPEndorsements onEndorseCountChange={handleInstallCountChange} />
      <ShowTransferEndorsements
        onEndorseCountChange={handleTransferCountChange}
      />
    </>
  );
};

export default PendingEndorsement;
