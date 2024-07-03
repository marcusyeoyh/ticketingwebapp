import React from "react";
import { GetRole } from "./utils/GetUserInfo";
import { Navigate } from "react-router-dom";

type PrivateRouteProps = {
  element: React.ReactElement;
  requiredRole: string[];
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  element,
  requiredRole,
}) => {
  const { userRole, loadingRole, errorRole } = GetRole();

  if (loadingRole) {
    return <div>Loading User Role...</div>;
  }
  if (errorRole) {
    return <div>Error: {errorRole}</div>;
  }

  if (!userRole) {
    return <Navigate to="/unauthorized" />;
  }

  if (!requiredRole.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }
  return element;
};

export default PrivateRoute;
