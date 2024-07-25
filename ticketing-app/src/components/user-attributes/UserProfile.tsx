import { useUser } from "../../UserContext";

// component that returns some attributes of the currently logged in user

const UserProfile = () => {
  // loads current user information
  const { user } = useUser();

  // returns selected attributes of the user account, No Information is shown when there is no value for that particular attribute
  return (
    <div style={{ margin: "1rem" }}>
      <h3>Your user profile:</h3>
      <p>
        <strong>Full Name: </strong>
        {user?.fullname ? user?.fullname : "No Information"}
      </p>
      <p>
        <strong>Email: </strong> {user?.email ? user?.email : "No Information"}
      </p>
      <p>
        <strong>Username: </strong>
        {user?.username ? user?.username : "No Information"}
      </p>
      <p>
        <strong>Role: </strong> {user?.role ? user?.role : "No Information"}
      </p>
    </div>
  );
};

export default UserProfile;
