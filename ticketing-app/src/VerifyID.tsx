import React, { useEffect, useState } from "react";
import { GetUsername } from "./utils/GetUserInfo";
import { Navigate, useParams } from "react-router-dom";
import { findRequests } from "./components/API";

type VerifyIDProps = {
  element: React.ReactElement;
};

const VerifyID: React.FC<VerifyIDProps> = ({ element }) => {
  const { id } = useParams<{ id: string }>();
  const { username, loadingUsername, errorUsername } = GetUsername();
  const [data, setData] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  if (loadingUsername) {
    return <div>Loading username...</div>;
  }
  if (errorUsername) {
    return <div>Error: {errorUsername}</div>;
  }

  useEffect(() => {
    const fetchData = async () => {
      if (username) {
        try {
          const response = await findRequests("/utils/findReq", username);
          setData(response);
        } catch (error) {
          setError(error as Error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [username]);

  if (loading) {
    return <div>Loading data from database...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (id) {
    let idNum = Number(id);
    if (data?.includes(idNum)) {
      return element;
    }
  }
  return <Navigate to="/unauthorized" />;
};

export default VerifyID;
