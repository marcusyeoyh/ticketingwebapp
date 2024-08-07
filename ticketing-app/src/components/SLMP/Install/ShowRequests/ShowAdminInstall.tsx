import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteReq, downloadCSV, findRequests } from "../../../API";

// component that returns all the Install requests in the database.

// datatype that contains all the attributes to be displayed on the table
type AllReq = {
  RequestID: string;
  FullName: string;
  Endorsed: string;
  Approved: string;
  Date: string;
};

const ShowAdminInstall = () => {
  // allows for navigation to view all the request data of a particular request id
  const navigate = useNavigate();

  // state that contains all the data for all install requests
  const [data, setData] = useState<AllReq[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // hook that finds all the install requests in the database and updates the data state.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await findRequests("/slmp/install/find-all", null);
        setData(response);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // handles navigation to show all information of a particular request
  const handleClick = (id: string) => {
    navigate(`/view-request/${id}`);
  };

  // handles downloading of all request information into a csv file
  const handleCSVClick = async () => {
    try {
      await downloadCSV("/slmp/install/downloadCSV", "install");
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  // handles deletion of a request when the delete button is clicked
  const deleteClick = async (id: string) => {
    try {
      await deleteReq("/submitslmp/install/deleteReq", id);
      setTimeout(() => {
        setData((prev) =>
          prev ? prev.filter((item) => item.RequestID !== id) : null
        );
      }, 500);
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  return (
    <div style={{ margin: "1rem" }}>
      <div className="d-flex justify-content-between">
        <h4>SLMP Install Records:</h4>
        {data && data.length > 0 && (
          // button to download a csv of all install requests
          <button className="btn btn-primary" onClick={() => handleCSVClick()}>
            Download CSV
          </button>
        )}
      </div>

      {data && data.length > 0 ? (
        <table className="table table-striped">
          <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Request ID</th>
              <th scope="col">Requestor</th>
              <th scope="col">Date Requested</th>
              <th scope="col">View Request</th>
              <th scope="col">Delete Request</th>
            </tr>
          </thead>
          <tbody>
            {data.map((request, index) => (
              <tr
                key={index}
                style={{ verticalAlign: "middle" }}
                id={`row-${request.RequestID}`}
                className="table-row"
              >
                <th scope="row">{request.RequestID}</th>
                <td>{request.FullName}</td>
                <td>{request.Date}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleClick(request.RequestID)}
                  >
                    More Information
                  </button>
                </td>
                <td>
                  {/* button to delete a particular request */}
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteClick(request.RequestID)}
                  >
                    Delete Request
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

export default ShowAdminInstall;
