import React from "react";
import { useUser } from "../../UserContext";

const UserProfile = () => {
  const { user, loading, error } = useUser();
  if (loading) return <div>loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>
        <strong>Full Name:</strong> {user?.full_name}
      </p>
      <p>
        <strong>Email:</strong> {user?.email}
      </p>
      <p>
        <strong>Username:</strong> {user?.username}
      </p>
      <p>
        <strong>Job Title:</strong> {user?.job_title}
      </p>
      <p>
        <strong>Department:</strong> {user?.department}
      </p>
      <p>
        <strong>Manager:</strong> {user?.manager}
      </p>
      <p>
        <strong>Role: </strong> {user?.user_role}
      </p>
    </div>
  );
};

export default UserProfile;
