import React from "react";
import HomePage from "./pages/Homepage";
import Requests from "./pages/Requests";
import { Route, Routes } from "react-router-dom";
import Profile from "./pages/Profile";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/requests" element={<Requests />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default AppRoutes;
