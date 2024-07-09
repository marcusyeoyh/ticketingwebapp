import React from "react";
import NavBar from "../../../components/NavBar";
import { useParams } from "react-router-dom";
import ShowDeleteSection1 from "../../../components/SLMP/Delete/Section 1/ShowDeleteSection1";
import ShowDeleteSection2 from "../../../components/SLMP/Delete/Section 2/ShowDeleteSection2";

const ViewDeleteRequest = () => {
  const { id } = useParams<{ id: string }>();
  if (id) {
    return (
      <>
        <NavBar />
        <ShowDeleteSection1 id={id} />
        <ShowDeleteSection2 id={id} />
      </>
    );
  } else return <div>No Request ID Input</div>;
};

export default ViewDeleteRequest;
