import React from "react";
import NavBar from "../../../components/NavBar";
import Transfer1 from "../../../components/SLMP/Transfer/Section 1/Transfer1";

const SLMPTransfer = () => {
  return (
    <>
      <NavBar />
      <div className="d-flex flex-column align-items-center text-center">
        <h3 style={{ margin: "0.5rem" }}>
          Software License Transfer Approval Form
        </h3>
        <p style={{ margin: "0.5rem" }}>
          Please fill up the below form to begin the process of transferring a
          software license
        </p>
      </div>
      <b style={{ margin: "0.5rem" }}>Note:</b>
      <ul style={{ margin: "0.5rem" }}>
        <li>Fields noted with an * are required fields</li>
        <li>
          Software Inventory Number <b>must</b> be set as NIL if none
        </li>
      </ul>
      <Transfer1 />
    </>
  );
};

export default SLMPTransfer;
