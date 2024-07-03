import React from "react";
import ShowSLMPApprovals from "./ShowApprovals/ShowSLMPApprovals";

type PendingApprovalProp = {
  onApprovalCountChange: (count: number) => void;
};

const PendingApproval: React.FC<PendingApprovalProp> = ({
  onApprovalCountChange,
}) => {
  return <ShowSLMPApprovals onApprovalCountChange={onApprovalCountChange} />;
};

export default PendingApproval;
