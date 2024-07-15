import NavBar from "../../../components/NavBar";
import { useParams } from "react-router-dom";
import ShowSLMPInstallFullSection1 from "../../../components/SLMP/Install/Section 1/ShowSection1";
import ShowSection2 from "../../../components/SLMP/Install/Section 2/ShowSection2";
import SignApproval from "../../../components/SLMP/Install/Section 3/SignApproval";

const ApproveRequests = () => {
  const { id } = useParams<{ id: string }>();
  if (id) {
    return (
      <>
        <NavBar />
        <ShowSLMPInstallFullSection1 id={id} />
        <ShowSection2 id={id} />
        <SignApproval id={id} />
      </>
    );
  }
  return <div>id cannot be null!</div>;
};

export default ApproveRequests;
