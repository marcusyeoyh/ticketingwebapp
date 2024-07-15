import { useParams } from "react-router-dom";
import NavBar from "../../../components/NavBar";
import SignEndorse from "../../../components/SLMP/Install/Section 2/SignEndorse";
import ShowSection1 from "../../../components/SLMP/Install/Section 1/ShowSection1";

const EndorseRequest = () => {
  const { id } = useParams<{ id: string }>();
  if (id) {
    return (
      <>
        <NavBar />
        <ShowSection1 id={id} />
        <SignEndorse id={id} />
      </>
    );
  } else return <div>No Request ID Input</div>;
};

export default EndorseRequest;
