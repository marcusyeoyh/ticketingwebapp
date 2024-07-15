import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

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
  user_role: string | null;
  mobile_number: string | null;
  object_guid: string | null;
  postal_code: string | null;
  state: string | null;
  street_address: string | null;
  telephone_number: string | null;
  user_principal_name: string | null;
  username: string;
}

interface UserContextType {
  user: UserInfo | null;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

const processData = (rawData: any): UserInfo => {
  const memberOf = Array.isArray(rawData.member_of)
    ? rawData.member_of.map(
        (group: string) => group.split(",")[0].split("=")[1]
      )
    : rawData.member_of.split(",")[0].split("=")[1];

  let userRole = "NIL";
  if (memberOf.includes("Administrators")) {
    userRole = "Administrators";
  } else if (memberOf.includes("Approving Officers")) {
    userRole = "Approving Officer";
  } else if (memberOf.includes("Endorsing Officers")) {
    userRole = "Endorsing Officer";
  }

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
    user_role: userRole,
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

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = "http://168.10.10.1:5000";
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/user/`, {
          withCredentials: true,
        });
        const processedData = processData(response.data);
        setUser(processedData);
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
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
