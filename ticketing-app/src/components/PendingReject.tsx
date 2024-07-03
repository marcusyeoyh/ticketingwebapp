import React from "react";
import ShowSLMPRejected from "./SLMP/Install/Rejected/ShowSLMPRejected";

type PendingRejectProps = {
  onRejectCountChange: (count: number) => void;
};

const PendingReject: React.FC<PendingRejectProps> = ({
  onRejectCountChange,
}) => {
  return <ShowSLMPRejected onRejectCountChange={onRejectCountChange} />;
};

export default PendingReject;
