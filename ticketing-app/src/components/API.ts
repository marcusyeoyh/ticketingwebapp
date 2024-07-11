import axios from "axios";

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
    a.download = `slmp_${type}_data.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
