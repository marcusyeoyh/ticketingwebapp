import React from "react";
import NavBar from "../components/NavBar";
import ShowAdminDelete from "../components/SLMP/Delete/ShowRequests/ShowAdminDelete";
import ShowAdminInstall from "../components/SLMP/Install/ShowRequests/ShowAdminInstall";
import ShowAdminTransfer from "../components/SLMP/Transfer/ShowRequests/ShowAdminTransfer";

const AdminViewAll = () => {
  return (
    <>
      <NavBar />
      <ShowAdminInstall />
      <ShowAdminTransfer />
      <ShowAdminDelete />
    </>
  );
};

export default AdminViewAll;
