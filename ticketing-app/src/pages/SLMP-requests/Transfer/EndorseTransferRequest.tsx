import { useParams } from "react-router-dom";
import NavBar from "../../../components/NavBar";
import ShowTransferSection1 from "../../../components/SLMP/Transfer/Section 1/ShowTransferSection1";
import SignEndorse from "../../../components/SLMP/Transfer/Section 2/SignEndorse";

// Page contains form and input fields for section 2 of a SLMP Transfer request
// Contains existing information for Section 1
// Allows for user attachment and Endorse and Reject options

const EndorseTransferRequest = () => {
  const { id } = useParams<{ id: string }>();
  if (id) {
    return (
      <>
        <NavBar />
        <ShowTransferSection1 id={id} />
        <SignEndorse id={id} />
      </>
    );
  } else return <div>No Request ID Input</div>;
};

export default EndorseTransferRequest;
