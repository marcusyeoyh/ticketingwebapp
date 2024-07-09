import React from "react";
import { useParams } from "react-router-dom";
import NavBar from "../../../components/NavBar";
import ShowTransferSection1 from "../../../components/SLMP/Transfer/Section 1/ShowTransferSection1";
import SignApprove from "../../../components/SLMP/Transfer/Section 3/SignApprove";
import ShowTransferSection2 from "../../../components/SLMP/Transfer/Section 2/ShowTransferSection2";

const ApproveTransferRequests = () => {
  const { id } = useParams<{ id: string }>();
  if (id) {
    return (
      <>
        <NavBar />
        <ShowTransferSection1 id={id} />
        <ShowTransferSection2 id={id} />
        <SignApprove id={id} />
      </>
    );
  } else return <div>No Request ID Input</div>;
};

export default ApproveTransferRequests;
