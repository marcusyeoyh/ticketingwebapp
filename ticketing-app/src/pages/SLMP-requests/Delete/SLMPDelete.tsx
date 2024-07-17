import NavBar from "../../../components/NavBar";
import Delete1 from "../../../components/SLMP/Delete/Section 1/Delete1";

// Page contains form and input fields for section 1 of a SLMP Delete request

const SLMPDelete = () => {
  return (
    <>
      <NavBar />
      <div className="d-flex flex-column align-items-center text-center">
        <h3 style={{ margin: "0.5rem" }}>Software License Removal Form</h3>
        <p style={{ margin: "0.5rem" }}>
          Please fill up the below form to begin the process of deleting a
          software license
        </p>
      </div>

      <b style={{ margin: "0.5rem" }}>Note:</b>
      <ul style={{ margin: "0.5rem" }}>
        <li>Fields noted with an * are required fields</li>
        <li>
          Software Inventory Number and Licensing Validy Period <b>must</b> be
          set as NIL if none
        </li>
      </ul>
      <Delete1 />
    </>
  );
};

export default SLMPDelete;
