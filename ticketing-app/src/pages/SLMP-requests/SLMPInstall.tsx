import NavBar from "../../components/NavBar";
import Install1 from "../../components/SLMP/Install/Install1";

const SLMPInstall = () => {
  return (
    <>
      <NavBar />
      <h3 style={{ margin: "0.5rem" }}>Software License Usage Approval Form</h3>
      <p style={{ margin: "0.5rem" }}>
        Please fill up the below form to begin the process of installing a new
        software license
      </p>
      <b style={{ margin: "0.5rem" }}>Note:</b>
      <ul style={{ margin: "0.5rem" }}>
        <li>Fields noted with an * are required fields</li>
        <li>
          Software Inventory Number and Licensing Validy Period <b>must</b> be
          set as NIL if none
        </li>
      </ul>
      <Install1 />
    </>
  );
};

export default SLMPInstall;
