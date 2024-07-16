import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { GetUsername } from "./utils/GetUserInfo";
import { findRequests } from "./components/API";

/*
Check to ensure that the user that is accepting the request matches with the new assignee field of the form when it was filled in section 1
*/

type AcceptRequestProps = {
  element: React.ReactElement;
};

const AcceptTransferRequest: React.FC<AcceptRequestProps> = ({ element }) => {
  //obtains id of request
  const { id } = useParams<{ id: string }>();

  //loads username of logged in user
  const { username, loadingUsername, errorUsername } = GetUsername();

  //stores list of ids that user is set as a new assignee, along with loading and error states if there are issues with getting the list of ids.
  const [data, setData] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  //handles if there are issues when loading username
  if (loadingUsername) {
    return <div>Loading username...</div>;
  }
  if (errorUsername) {
    return <div>Error: {errorUsername}</div>;
  }

  //loads the list of requests that contains the current user as a new assignee when the username state is updated.
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

  //handles errors regarding loading the list of ids from the database
  if (loading) {
    return <div>Loading data from database...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  //if the id trying to be accessed matches with the list, then the correct element is loaded, if not redirect to unauthorized page
  if (id) {
    let idNum = Number(id);
    if (data?.includes(idNum)) {
      return element;
    }
  }
  return <Navigate to="/unauthorized" />;
};

export default AcceptTransferRequest;
