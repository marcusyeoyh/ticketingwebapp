import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const FetchDataTest = () => {
  const [data, setData] = useState<{ members: string[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    console.log("API Base URL:", apiUrl);

    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/testdb`);
        setData(response.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <h1>Fetched Data is: </h1>
      {loading && <div>Loading...</div>}
      {data && (
        <ul>
          {data.members.map((member, index) => (
            <li key={index}>{member}</li>
          ))}
        </ul>
      )}
      {error && <div>Error: {error}</div>}
    </>
  );
};

export default FetchDataTest;
