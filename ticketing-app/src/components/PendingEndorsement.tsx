import React from "react";
import ShowSLMPEndorsements from "./ShowEndorsements/ShowSLMPEndorsements";

type PendingEndorsementProps = {
  onEndorseCountChange: (count: number) => void;
};

const PendingEndorsement: React.FC<PendingEndorsementProps> = ({
  onEndorseCountChange,
}) => {
  return (
    <>
      <ShowSLMPEndorsements onEndorseCountChange={onEndorseCountChange} />
    </>
  );
};

export default PendingEndorsement;
