import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const FetchUserName = () => {
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
  return <div>FetchUserName</div>;
};

export default FetchUserName;
