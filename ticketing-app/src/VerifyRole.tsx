import React from "react";
import { GetRole } from "./utils/GetUserInfo";
import { Navigate } from "react-router-dom";

/*
Checks to see if the logged in user has a role that matches the roles that are allowed to access the link
Prevents users that do not have the correct roles from endorsing or approving requests
*/

//prop that stores the correct element to be redirected to and a string array of the acceptible roles that can access this link
type VerifyRoleProps = {
  element: React.ReactElement;
  requiredRole: string[];
};

const VerifyRole: React.FC<VerifyRoleProps> = ({ element, requiredRole }) => {
  //gets user role of the logged in user
  const { userRole, loadingRole, errorRole } = GetRole();

  //handles loading and errors when loading user role
  if (loadingRole) {
    return <div>Loading User Role...</div>;
  }
  if (errorRole) {
    return <div>Error: {errorRole}</div>;
  }

  //redirects to unauthorized page if there is no user role detected
  if (!userRole) {
    return <Navigate to="/unauthorized" />;
  }

  //redirects to unauthorized if user's role is not in the string array of acceptible roles
  if (!requiredRole.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }
  //redirects to correct link if role matches
  return element;
};

export default VerifyRole;
