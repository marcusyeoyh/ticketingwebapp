import React from "react";
import NavBar from "../../components/NavBar";
import { useParams } from "react-router-dom";
import ShowSLMPInstallFullSection1 from "../../components/ShowRequests/ShowSLMPInstallFull-1";
import ShowSection2 from "../../components/SLMP/Install/Section 2/ShowSection2";
import ShowSection3 from "../../components/SLMP/Install/Section 3/ShowSection3";

const ViewRequest = () => {
  const { id } = useParams<{ id: string }>();
  if (id) {
    return (
      <>
        <NavBar />
        <ShowSLMPInstallFullSection1 id={id} />
        <ShowSection2 id={id} />
        <ShowSection3 id={id} />
      </>
    );
  } else return <div>No Request ID Input</div>;
};

export default ViewRequest;
