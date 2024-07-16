import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetUsername } from "../../../../utils/GetUserInfo";
import { findRequests } from "../../../API";

// Component that shows the user’s delete request history

// datatype that stores needed information about each request
type AllReq = {
  RequestID: number;
  Endorsed: string;
  Date: string;
};

const ShowAllDelete = () => {
  // allows navigation to view information about the particular request
  const navigate = useNavigate();

  // obtains username of user
  const { username, loadingUsername, errorUsername } = GetUsername();

  // array of requests that have be raised by the user
  const [data, setData] = useState<AllReq[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  if (loadingUsername) {
    return <div>Loading username...</div>;
  }

  if (errorUsername) {
    return <div>Error: {errorUsername}</div>;
  }

  // hook to find all delete requests raised by the user
  useEffect(() => {
    const fetchData = async () => {
      if (username) {
        try {
          const response = await findRequests(
            "/slmp/delete/find-all",
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
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // handles redirection when button is clicked to view more information about the particular request
  const handleClick = (id: number) => {
    navigate(`/view-delete-request/${id}`);
  };

  return (
    <div style={{ margin: "1rem" }}>
      <h4>Your SLMP Remove Request History:</h4>
      {data && data.length > 0 ? (
        <table className="table table-striped">
          <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: "52%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "10%" }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Request ID</th>
              <th scope="col">Endorsed Status</th>
              <th scope="col">Date Requested</th>
              <th scope="col">Further Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((request, index) => (
              <tr key={index} style={{ verticalAlign: "middle" }}>
                <th scope="row">{request.RequestID}</th>
                <td>{request.Endorsed}</td>
                <td>{request.Date}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleClick(request.RequestID)}
                  >
                    More Information
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No prior requests.</p>
      )}
    </div>
  );
};

export default ShowAllDelete;
