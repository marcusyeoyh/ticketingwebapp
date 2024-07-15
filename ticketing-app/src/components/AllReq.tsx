import React from "react";
import ShowAllReq from "./SLMP/Install/ShowRequests/ShowAllReq";
import ShowAll from "./SLMP/Transfer/ShowRequests/ShowAll";
import ShowAllDelete from "./SLMP/Delete/ShowRequests/ShowAllDelete";

const AllReq = () => {
  return (
    <>
      <ShowAllReq />
      <ShowAll />
      <ShowAllDelete />
    </>
  );
};

export default AllReq;
