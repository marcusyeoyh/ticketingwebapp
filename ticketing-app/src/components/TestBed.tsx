import React, { useEffect, useState } from "react";
import { getUsers } from "./API";

type userData = {
  username: string;
  full_name: string;
};

const testbed = () => {
  const [users, setUsers] = useState<userData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUsers("Remote Desktop Users");
        setUsers(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <div>Error {error.message}</div>;
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {users && users.length > 0 ? (
        users.map((user) => (
          <li key={user.username}>
            {user.full_name} ({user.username})
          </li>
        ))
      ) : (
        <li>No users found</li>
      )}
    </ul>
  );
};

export default testbed;
