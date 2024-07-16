import NavBar from "../components/NavBar";
import ProcessSelect from "../components/ProcessSelect";

// Page that allows user to raise a request

const Requests = () => {
  return (
    <>
      <NavBar />
      <h3 style={{ margin: "0.5rem" }}>
        What request would you like to make today?
      </h3>
      {/* shows requests that the user can select */}
      <ProcessSelect />
    </>
  );
};

export default Requests;
