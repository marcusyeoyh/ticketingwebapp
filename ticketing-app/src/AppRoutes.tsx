import React from "react";
import HomePage from "./pages/Homepage";
import Requests from "./pages/Requests";
import { Route, Routes } from "react-router-dom";
import Profile from "./pages/Profile";
import SLMPInstall from "./pages/SLMP-requests/SLMPInstall";
import SLMPDelete from "./pages/SLMP-requests/SLMPDelete";
import SLMPTransfer from "./pages/SLMP-requests/SLMPTransfer";
import FormSubmitted from "./pages/SLMP-requests/FormSubmitted";
import ViewRequest from "./pages/ViewRequest";
import EndorseRequest from "./pages/EndorseRequest";
import PrivateRoute from "./PrivateRoute";
import UnauthorizedAccess from "./pages/UnauthorizedAccess";
import FormEndorsed from "./pages/SLMP-requests/FormEndorsed";
import ApproveRequests from "./pages/SLMP-requests/ApproveRequests";
import FormApproved from "./pages/SLMP-requests/FormApproved";
import RequestRejected from "./pages/SLMP-requests/RequestRejected";
import AmendRequest from "./AmendRequest";
import FormAmend from "./pages/SLMP-requests/FormAmend";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/requests" element={<Requests />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/slmp-install" element={<SLMPInstall />} />
      <Route path="/slmp-transfer" element={<SLMPTransfer />} />
      <Route path="/slmp-delete" element={<SLMPDelete />} />
      <Route path="/form-submitted" element={<FormSubmitted />} />
      <Route path="/view-request/:id" element={<ViewRequest />} />

      <Route
        path="/endorse-request/:id"
        element={
          <PrivateRoute
            element={<EndorseRequest />}
            requiredRole={["Endorsing Officer", "Approving Officer"]}
          />
        }
      />
      <Route
        path="/approve-request/:id"
        element={
          <PrivateRoute
            element={<ApproveRequests />}
            requiredRole={["Approving Officer"]}
          />
        }
      />
      <Route path="/unauthorized" element={<UnauthorizedAccess />} />
      <Route path="/form-endorsed" element={<FormEndorsed />} />
      <Route path="/form-approved" element={<FormApproved />} />
      <Route path="/request-rejected" element={<RequestRejected />} />
      <Route
        path="/amend-request/:id"
        element={<AmendRequest element={<FormAmend />} />}
      />
    </Routes>
  );
};

export default AppRoutes;
