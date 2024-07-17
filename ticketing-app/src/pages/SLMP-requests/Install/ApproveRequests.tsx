import NavBar from "../../../components/NavBar";
import { useParams } from "react-router-dom";
import ShowSection2 from "../../../components/SLMP/Install/Section 2/ShowSection2";
import SignApproval from "../../../components/SLMP/Install/Section 3/SignApproval";
import ShowSection1 from "../../../components/SLMP/Install/Section 1/ShowSection1";

// Page with form for section 3 of the install request

const ApproveRequests = () => {
  const { id } = useParams<{ id: string }>();
  if (id) {
    return (
      <>
        <NavBar />

        {/* show prior section 1 information */}
        <ShowSection1 id={id} />

        {/* show prior section 2 information */}
        <ShowSection2 id={id} />

        {/* form for section 3 */}
        <SignApproval id={id} />
      </>
    );
  }
  return <div>id cannot be null!</div>;
};

export default ApproveRequests;
