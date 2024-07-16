import NavBar from "../components/NavBar";
import TaskBar from "../components/TaskBar";
import { GetFullName } from "../utils/GetUserInfo";

/*
Landing page when application is first accessed.
*/

const Homepage = () => {
  //load full name of logged in user
  const { fullname, loadingFullname, errorFullname } = GetFullName();

  //handles loading and error when loading full name
  if (loadingFullname) {
    return <div>Loading Name...</div>;
  }

  if (errorFullname) {
    return <div>Error: {errorFullname}</div>;
  }

  return (
    <>
      <NavBar />
      {/* Checks if there is any fullname detected and indicates an error if there isnt */}
      {fullname ? (
        <h3 style={{ margin: "0.5rem" }}>
          What would you like to do today {fullname}?
        </h3>
      ) : (
        <h3>Error: No error when detecting logged in user</h3>
      )}
      {/* Taskbar containing various actions to raise requests, view requests and approve/endorse requests */}
      <TaskBar />
    </>
  );
};

export default Homepage;
