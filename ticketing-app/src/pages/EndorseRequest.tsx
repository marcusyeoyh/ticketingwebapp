import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import ShowSLMPInstallFullSection1 from "../components/ShowRequests/ShowSLMPInstallFull-1";
import SignEndorse from "../components/SignEndorse";

const EndorseRequest = () => {
  const { id } = useParams<{ id: string }>();
  if (id) {
    return (
      <>
        <NavBar />
        <ShowSLMPInstallFullSection1 id={id} />
        <SignEndorse id={id} />
      </>
    );
  } else return <div>No Request ID Input</div>;
};

export default EndorseRequest;
