import React from "react";
import { useUser } from "../UserContext";

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
