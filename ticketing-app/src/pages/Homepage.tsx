import React from "react";
import UserName from "../components/user-attributes/UserName";
import NavBar from "../components/NavBar";
import ProcessSelect from "../components/ProcessSelect";

const Homepage = () => {
  return (
    <>
      <NavBar />
      <h3>
        What process would you like to raise today <UserName />?
      </h3>
      <ProcessSelect />
    </>
  );
};

export default Homepage;
