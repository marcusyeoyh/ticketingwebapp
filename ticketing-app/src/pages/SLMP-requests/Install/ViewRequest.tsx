import NavBar from "../../../components/NavBar";
import { useParams } from "react-router-dom";
import ShowSection2 from "../../../components/SLMP/Install/Section 2/ShowSection2";
import ShowSection3 from "../../../components/SLMP/Install/Section 3/ShowSection3";
import ShowSection1 from "../../../components/SLMP/Install/Section 1/ShowSection1";

// Page that shows all the current information of a particular Install request
// Information is split into section 1 to 3 and is not shown if a particular section is still pending

const ViewRequest = () => {
  // obtains id of the request to be displayed
  const { id } = useParams<{ id: string }>();
  if (id) {
    return (
      <>
        <NavBar />

        {/* shows information for section 1 */}
        <ShowSection1 id={id} />

        {/* shows information for section 2 */}
        <ShowSection2 id={id} />

        {/* shows information for section 3 */}
        <ShowSection3 id={id} />
      </>
    );
  } else return <div>No Request ID Input</div>;
};

export default ViewRequest;
