import { useUser } from "../UserContext";
import NavBar from "../components/NavBar";
import TaskBar from "../components/TaskBar";

/*
Landing page when application is first accessed.
*/

const Homepage = () => {
  //load full name of logged in user
  const { user } = useUser();

  return (
    <>
      <NavBar />
      {/* Checks if there is any fullname detected and indicates an error if there isnt */}
      {user?.fullname ? (
        <h3 style={{ margin: "0.5rem" }}>
          What would you like to do today {user.fullname}?
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
