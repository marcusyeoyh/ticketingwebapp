import React, { useEffect, useState } from "react";
import { GetUsername } from "./utils/GetUserInfo";
import { Navigate, useParams } from "react-router-dom";
import { findRequests } from "./components/API";

/*
Contains check to ensure that user logged in has raised the request that is trying to be ammended
Prevents users from ammending requests that they themselves have not raised
*/

type VerifyIDProps = {
  element: React.ReactElement;
};

const VerifyID: React.FC<VerifyIDProps> = ({ element }) => {
  // Get id of request that is being accessed
  const { id } = useParams<{ id: string }>();

  //get username of logged in user, along with loading and error variables when loading username
  const { username, loadingUsername, errorUsername } = GetUsername();

  //variable to store ids of requests raised by logged in user along with loading and error states
  const [data, setData] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  //handle case that username is still being loaded or if there are errors when loading username
  if (loadingUsername) {
    return <div>Loading username...</div>;
  }
  if (errorUsername) {
    return <div>Error: {errorUsername}</div>;
  }

  //loads requests of logged in user after username is obtained
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

  //handles case if results are loading or if there are errors when obtaining the data from the database.
  if (loading) {
    return <div>Loading data from database...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  //checks if the request id requested matches the array of ids raised by the user and allows access to the amend page if there is match
  //and redirects to an unauthorised if there is not a match
  if (id) {
    let idNum = Number(id);
    if (data?.includes(idNum)) {
      return element;
    }
  }
  return <Navigate to="/unauthorized" />;
};

export default VerifyID;
