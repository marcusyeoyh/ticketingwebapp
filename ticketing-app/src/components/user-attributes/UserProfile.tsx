import { useUser } from "../../UserContext";

// component that returns some attributes of the currently logged in user

const UserProfile = () => {
  // loads current user information
  const { user, loading, error } = useUser();
  if (loading) return <div>loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // returns selected attributes of the user account, No Information is shown when there is no value for that particular attribute
  return (
    <div style={{ margin: "1rem" }}>
      <h3>Your user profile:</h3>
      <p>
        <strong>Full Name:</strong>
        {user?.full_name ? user?.full_name : "No Information"}
      </p>
      <p>
        <strong>Email:</strong> {user?.email ? user?.email : "No Information"}
      </p>
      <p>
        <strong>Username:</strong>
        {user?.username ? user?.username : "No Information"}
      </p>
      <p>
        <strong>Job Title:</strong>
        {user?.job_title ? user?.job_title : "No Information"}
      </p>
      <p>
        <strong>Department:</strong>{" "}
        {user?.department ? user?.department : "No Information"}
      </p>
      <p>
        <strong>Manager:</strong>{" "}
        {user?.manager ? user?.manager : "No Information"}
      </p>
      <p>
        <strong>Role: </strong>{" "}
        {user?.user_role ? user?.user_role : "No Information"}
      </p>
    </div>
  );
};

export default UserProfile;
