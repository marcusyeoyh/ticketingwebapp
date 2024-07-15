import { useUser } from "../../UserContext";

const UserProfile = () => {
  const { user, loading, error } = useUser();
  if (loading) return <div>loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
