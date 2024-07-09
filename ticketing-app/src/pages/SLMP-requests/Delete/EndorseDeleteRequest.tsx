import React from "react";
import { useParams } from "react-router-dom";
import NavBar from "../../../components/NavBar";
import ShowDeleteSection1 from "../../../components/SLMP/Delete/Section 1/ShowDeleteSection1";
import SignEndorse from "../../../components/SLMP/Delete/Section 2/SignEndorse";

const EndorseDeleteRequest = () => {
  const { id } = useParams<{ id: string }>();
  if (id) {
    return (
      <>
        <NavBar />
        <ShowDeleteSection1 id={id} />
        <SignEndorse id={id} />
      </>
    );
  } else return <div>No Request ID Input</div>;
};

export default EndorseDeleteRequest;
