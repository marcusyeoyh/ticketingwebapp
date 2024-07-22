import axios, { AxiosError } from "axios";

const apiUrl = "http://168.10.10.1:5000";

export const submitForm = async (endpoint: string, formData: any) => {
  try {
    const response = await axios.post(`${apiUrl}${endpoint}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error submitting form:",
      error.response || error.message || error
    );
    throw error;
  }
};

export const findRequests = async (endpoint: string, user: string | null) => {
  try {
    const response = await axios.get(`${apiUrl}${endpoint}`, {
      params: { user: user },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error finding requests",
      error.response || error.message || error
    );
    throw error;
  }
};

export const findEndorsements = async (endpoint: string, user: string) => {
  try {
    const response = await axios.get(`${apiUrl}${endpoint}`, {
      params: { user: user },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error finding requests",
      error.response || error.message || error
    );
    throw error;
  }
};

export const findApprovals = async (endpoint: string, user: string) => {
  try {
    const response = await axios.get(`${apiUrl}${endpoint}`, {
      params: { user: user },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error finding requests",
      error.response || error.message || error
    );
    throw error;
  }
};

export const findSec1Info = async (endpoint: string, reqID: string) => {
  try {
    const response = await axios.get(`${apiUrl}${endpoint}`, {
      params: { reqID: reqID },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error finding requests",
      error.response || error.message || error
    );
    throw error;
  }
};

export const downloadFile = async (filePath: string) => {
  try {
    const endpoint = "/download-pdf";
    const response = await axios.get(`${apiUrl}${endpoint}`, {
      params: { file_path: filePath },
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filePath.split("/").pop()!);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

export const downloadCSV = async (endpoint: string, type: string) => {
  try {
    const response = await axios.get(`${apiUrl}${endpoint}`, {
      withCredentials: true,
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(response.data);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;

    const now = new Date();
    const dateString = now.toISOString();

    a.download = `slmp_${type}_data_${dateString}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getUsers = async (group: string) => {
  try {
    const response = await axios.get(`${apiUrl}/api/user/getgroupusers`, {
      params: { group: group },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(
          "Server responded with error:",
          axiosError.response.status,
          axiosError.response.data
        );
        if (axiosError.response.status === 404) {
          throw new Error("Users not found or group does not exist");
        }
      } else if (axiosError.request) {
        // The request was made but no response was received
        console.error("No response received:", axiosError.request);
        throw new Error("No response received from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", axiosError.message);
        throw new Error("Error setting up request");
      }
    }
    console.error("Unexpected error:", error);
    throw new Error("An unexpected error occurred");
  }
};

export const deleteReq = async (endpoint: string, reqID: string) => {
  try {
    const response = await axios.delete(`${apiUrl}${endpoint}`, {
      params: { reqID: reqID },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error finding requests",
      error.response || error.message || error
    );
    throw error;
  }
};
