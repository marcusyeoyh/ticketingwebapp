import { useParams } from "react-router-dom";
import NavBar from "../../../components/NavBar";
import SignEndorse from "../../../components/SLMP/Install/Section 2/SignEndorse";
import ShowSection1 from "../../../components/SLMP/Install/Section 1/ShowSection1";

// Page with form for section 2 of the install request

const EndorseRequest = () => {
  const { id } = useParams<{ id: string }>();
  if (id) {
    return (
      <>
        <NavBar />

        {/* show section 1 information */}
        <ShowSection1 id={id} />

        {/* input fields for endorser to fill in */}
        <SignEndorse id={id} />
      </>
    );
  } else return <div>No Request ID Input</div>;
};

export default EndorseRequest;
