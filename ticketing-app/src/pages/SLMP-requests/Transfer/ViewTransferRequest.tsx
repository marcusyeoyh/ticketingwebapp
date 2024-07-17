import { useParams } from "react-router-dom";
import NavBar from "../../../components/NavBar";
import ShowTransferSection1 from "../../../components/SLMP/Transfer/Section 1/ShowTransferSection1";
import ShowTransferSection2 from "../../../components/SLMP/Transfer/Section 2/ShowTransferSection2";
import ShowTransferSection3 from "../../../components/SLMP/Transfer/Section 3/ShowTransferSection3";
import ShowTransferSection4 from "../../../components/SLMP/Transfer/Section 4/ShowTransferSection4";

// Page that shows all the current information of a particular Transfer request
// Information is split into section 1, 2, 3 and 4 and a section not shown if the particular section is still pending

const ViewTransferRequest = () => {
  const { id } = useParams<{ id: string }>();
  if (id) {
    return (
      <>
        <NavBar />
        <ShowTransferSection1 id={id} />
        <ShowTransferSection2 id={id} />
        <ShowTransferSection3 id={id} />
        <ShowTransferSection4 id={id} />
      </>
    );
  } else return <div>No Request ID Input</div>;
};

export default ViewTransferRequest;
