import React, { useState, useEffect } from "react";
import axios from "axios";

const FetchDataTest = () => {
  interface UserInfo {
    city: string | null;
    company: string | null;
    country: string | null;
    department: string | null;
    display_name: string | null;
    email: string;
    employee_id: string | null;
    first_name: string | null;
    full_name: string;
    job_title: string | null;
    last_name: string | null;
    manager: string | null;
    member_of: string[] | null;
    mobile_number: string | null;
    object_guid: string | null;
    postal_code: string | null;
    state: string | null;
    street_address: string | null;
    telephone_number: string | null;
    user_principal_name: string | null;
    username: string;
  }

  const processData = (rawData: any): UserInfo => {
    console.log("Raw Data:", rawData);

    return {
      city: rawData.city,
      company: rawData.company,
      country: rawData.country,
      department: rawData.department,
      display_name: rawData.display_name,
      email: rawData.email,
      employee_id: rawData.employee_id,
      first_name: rawData.first_name,
      full_name: rawData.full_name,
      job_title: rawData.job_title,
      last_name: rawData.last_name,
      manager: rawData.manager
        ? rawData.manager.split(",")[0].split("=")[1]
        : null,
      member_of: rawData.member_of
        ? rawData.member_of.split(",")[0].split("=")[1]
        : null,
      mobile_number: rawData.mobile_number,
      object_guid: rawData.object_guid,
      postal_code: rawData.postal_code,
      state: rawData.state,
      street_address: rawData.street_address,
      telephone_number: rawData.telephone_number,
      user_principal_name: rawData.user_principal_name,
      username: rawData.username,
    };
  };

  const [data, setData] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl =
      import.meta.env.VITE_API_BASE_URL || "http://168.10.10.1:5000";
    console.log("API Base URL:", apiUrl);

    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/user`, {
          withCredentials: true,
        });
        const processedData = processData(response.data);
        console.log("Processed Data:", processedData);
        setData(processedData);
      } catch (error: any) {
        setError(error.message);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <h1>Fetched Data is:</h1>
      {loading && <div>Loading...</div>}
      {data && (
        <div>
          <p>
            <strong>Full Name:</strong> {data.full_name}
          </p>
          <p>
            <strong>Email:</strong> {data.email}
          </p>
          <p>
            <strong>Username:</strong> {data.username}
          </p>
          <p>
            <strong>Job Title:</strong> {data.job_title}
          </p>
          <p>
            <strong>Department:</strong> {data.department}
          </p>
          <p>
            <strong>Manager:</strong> {data.manager}
          </p>
          <p>
            <strong>Member Of:</strong>
            {data.member_of}
          </p>
        </div>
      )}
      {error && <div>Error: {error}</div>}
    </>
  );
};

export default FetchDataTest;
