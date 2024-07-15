import NavBar from "../components/NavBar";
import TaskBar from "../components/TaskBar";
import { GetFullName } from "../utils/GetUserInfo";

const Homepage = () => {
  const { fullname, loadingFullname, errorFullname } = GetFullName();

  if (loadingFullname) {
    return <div>Loading Name...</div>;
  }

  if (errorFullname) {
    return <div>Error: {errorFullname}</div>;
  }

  return (
    <>
      <NavBar />
      <h3 style={{ margin: "0.5rem" }}>
        What would you like to do today {fullname}?
      </h3>
      <TaskBar />
    </>
  );
};

export default Homepage;
