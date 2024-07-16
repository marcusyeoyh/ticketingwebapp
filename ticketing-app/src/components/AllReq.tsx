import ShowAllReq from "./SLMP/Install/ShowRequests/ShowAllReq";
import ShowAllDelete from "./SLMP/Delete/ShowRequests/ShowAllDelete";
import ShowAllTransfer from "./SLMP/Transfer/ShowRequests/ShowAllTransfer";

// Component that shows the user’s request history

const AllReq = () => {
  return (
    <>
      <ShowAllReq />
      <ShowAllTransfer />
      <ShowAllDelete />
    </>
  );
};

export default AllReq;
