import React from "react";
import NavBar from "../components/NavBar";
import ProcessSelect from "../components/ProcessSelect";

const Requests = () => {
  return (
    <>
      <NavBar />
      <h3 style={{ margin: "0.5rem" }}>
        What request would you like to make today?
      </h3>
      <ProcessSelect />
    </>
  );
};

export default Requests;
