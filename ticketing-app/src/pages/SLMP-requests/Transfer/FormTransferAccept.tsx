import { useParams } from "react-router-dom";
import NavBar from "../../../components/NavBar";
import ShowTransferSection1 from "../../../components/SLMP/Transfer/Section 1/ShowTransferSection1";
import ShowTransferSection2 from "../../../components/SLMP/Transfer/Section 2/ShowTransferSection2";
import ShowTransferSection3 from "../../../components/SLMP/Transfer/Section 3/ShowTransferSection3";
import SignAccept from "../../../components/SLMP/Transfer/Section 4/SignAccept";

// Page contains form and input fields for section 4 of a SLMP Transfer request
// Contains existing information for Section 1, 2 and 3
// Allows Accept and Reject options

const FormTransferAccept = () => {
  const { id } = useParams<{ id: string }>();
  if (id) {
    return (
      <>
        <NavBar />
        <ShowTransferSection1 id={id} />
        <ShowTransferSection2 id={id} />
        <ShowTransferSection3 id={id} />
        <SignAccept id={id} />
      </>
    );
  } else return <div>No Request ID Input</div>;
};

export default FormTransferAccept;
