import NavBar from "../../../components/NavBar";
import { useParams } from "react-router-dom";
import ShowSection2 from "../../../components/SLMP/Install/Section 2/ShowSection2";
import ShowSection3 from "../../../components/SLMP/Install/Section 3/ShowSection3";
import ShowSection1 from "../../../components/SLMP/Install/Section 1/ShowSection1";

const ViewRequest = () => {
  const { id } = useParams<{ id: string }>();
  if (id) {
    return (
      <>
        <NavBar />
        <ShowSection1 id={id} />
        <ShowSection2 id={id} />
        <ShowSection3 id={id} />
      </>
    );
  } else return <div>No Request ID Input</div>;
};

export default ViewRequest;
