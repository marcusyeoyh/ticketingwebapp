import NavBar from "../components/NavBar";
import ShowAdminDelete from "../components/SLMP/Delete/ShowRequests/ShowAdminDelete";
import ShowAdminInstall from "../components/SLMP/Install/ShowRequests/ShowAdminInstall";
import ShowAdminTransfer from "../components/SLMP/Transfer/ShowRequests/ShowAdminTransfer";

// Page only visible to administrator accounts that allow the viewing and downloading of all requests in the database.
// Allows for deletion of requests as well
const AdminViewAll = () => {
  return (
    <>
      <NavBar />
      {/* Shows all Install requests */}
      <ShowAdminInstall />
      {/* Shows all Transfer requests */}
      <ShowAdminTransfer />
      {/* Shows all Delete requests */}
      <ShowAdminDelete />
    </>
  );
};

export default AdminViewAll;
