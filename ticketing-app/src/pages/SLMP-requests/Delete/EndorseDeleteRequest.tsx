import { useParams } from "react-router-dom";
import NavBar from "../../../components/NavBar";
import ShowDeleteSection1 from "../../../components/SLMP/Delete/Section 1/ShowDeleteSection1";
import SignEndorse from "../../../components/SLMP/Delete/Section 2/SignEndorse";

// Page contains form and input fields for section 2 of a SLMP Delete request.
// Contains existing information for Section 1
// Allows for user attachment and Endorse and Reject options

const EndorseDeleteRequest = () => {
  const { id } = useParams<{ id: string }>();
  if (id) {
    return (
      <>
        <NavBar />
        <ShowDeleteSection1 id={id} />
        <SignEndorse id={id} />
      </>
    );
  } else return <div>No Request ID Input</div>;
};

export default EndorseDeleteRequest;
