import { useUser } from "../UserContext";

/*
Contains functions that call the User context and return specific attributes of the current logged in user
*/

//returns username of user - unique identifier for users in the Active Directory
export const GetUsername = () => {
  const { user } = useUser();
  return {
    username: user?.username,
  };
};

//returns full name of user, used in forms
export const GetFullName = () => {
  const { user } = useUser();
  return {
    fullname: user?.fullname,
  };
};

//returns role of user, used in role checking for endorsing and approvals
export const GetRole = () => {
  const { user } = useUser();

  return {
    userRole: user?.role,
    loadingRole: false,
    errorRole: null,
  };
};
