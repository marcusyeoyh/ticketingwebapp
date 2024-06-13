import React from "react";
import { useUser } from "../../UserContext";

const UserName = () => {
  const { user, loading, error } = useUser();
  if (loading) return <div>loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <span>{user?.username}</span>;
};

export default UserName;
