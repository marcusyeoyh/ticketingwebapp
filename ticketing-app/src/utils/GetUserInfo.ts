import { useUser } from "../UserContext";

/*
Contains functions that call the User context and return specific attributes of the current logged in user
*/

//returns username of user - unique identifier for users in the Active Directory
export const GetUsername = () => {
  const { user, loading, error } = useUser();
  if (loading || !user) {
    return { username: null, loading: true, error: null };
  }
  if (error) {
    return { username: null, loading: false, error };
  }
  return {
    username: user?.username,
    loadingUsername: false,
    errorUsername: null,
  };
};

//returns full name of user, used in forms
export const GetFullName = () => {
  const { user, loading, error } = useUser();
  if (loading || !user) {
    return { fullname: null, loading: true, error: null };
  }
  if (error) {
    return { fullname: null, loading: false, error };
  }
  return {
    fullname: user?.full_name,
    loadingFullname: false,
    errorFullname: null,
  };
};

//returns role of user, used in role checking for endorsing and approvals
export const GetRole = () => {
  const { user, loading, error } = useUser();
  if (loading || !user) {
    return { fullname: null, loading: true, error: null };
  }
  if (error) {
    return { fullname: null, loading: false, error };
  }
  return {
    userRole: user?.user_role,
    loadingRole: false,
    errorRole: null,
  };
};
