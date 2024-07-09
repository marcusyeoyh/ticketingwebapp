import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { GetUsername } from "./utils/GetUserInfo";
import { findRequests } from "./components/API";

type AcceptRequestProps = {
  element: React.ReactElement;
};

const AcceptTransferRequest: React.FC<AcceptRequestProps> = ({ element }) => {
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
          const response = await findRequests(
            "/slmp/transfer/find-newAssignee",
            username
          );
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

export default AcceptTransferRequest;
