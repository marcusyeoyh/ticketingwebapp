import { useParams } from "react-router-dom";
import NavBar from "../../../components/NavBar";
import ShowTransferSection1 from "../../../components/SLMP/Transfer/Section 1/ShowTransferSection1";
import SignApprove from "../../../components/SLMP/Transfer/Section 3/SignApprove";
import ShowTransferSection2 from "../../../components/SLMP/Transfer/Section 2/ShowTransferSection2";

// Page contains form and input fields for section 3 of a SLMP Transfer request
// Contains existing information for Section 1 and 2
// Allows for user attachment and Endorse and Reject options

const ApproveTransferRequests = () => {
  const { id } = useParams<{ id: string }>();
  if (id) {
    return (
      <>
        <NavBar />
        <ShowTransferSection1 id={id} />
        <ShowTransferSection2 id={id} />
        <SignApprove id={id} />
      </>
    );
  } else return <div>No Request ID Input</div>;
};

export default ApproveTransferRequests;
