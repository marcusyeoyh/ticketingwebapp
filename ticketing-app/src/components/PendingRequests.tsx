import React from "react";
import ShowSLMPInstall from "./ShowRequests/ShowSLMPInstall";

type PendingRequestsProps = {
  onPendingCountChange: (count: number) => void;
};

const PendingRequests: React.FC<PendingRequestsProps> = ({
  onPendingCountChange,
}) => {
  return (
    <>
      <ShowSLMPInstall onPendingCountChange={onPendingCountChange} />
    </>
  );
};

export default PendingRequests;
