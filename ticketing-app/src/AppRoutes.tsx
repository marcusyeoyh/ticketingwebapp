import HomePage from "./pages/Homepage";
import Requests from "./pages/Requests";
import { Route, Routes, useNavigate } from "react-router-dom";
import Profile from "./pages/Profile";
import SLMPInstall from "./pages/SLMP-requests/Install/SLMPInstall";
import SLMPDelete from "./pages/SLMP-requests/Delete/SLMPDelete";
import SLMPTransfer from "./pages/SLMP-requests/Transfer/SLMPTransfer";
import FormSubmitted from "./pages/SLMP-requests/FormSubmitted";
import ViewRequest from "./pages/SLMP-requests/Install/ViewRequest";
import EndorseRequest from "./pages/SLMP-requests/Install/EndorseRequest";
import VerifyRole from "./VerifyRole";
import UnauthorizedAccess from "./pages/UnauthorizedAccess";
import FormEndorsed from "./pages/SLMP-requests/FormEndorsed";
import ApproveRequests from "./pages/SLMP-requests/Install/ApproveRequests";
import FormApproved from "./pages/SLMP-requests/FormApproved";
import RequestRejected from "./pages/SLMP-requests/RequestRejected";
import VerifyID from "./VerifyID";
import FormAmend from "./pages/SLMP-requests/Install/FormAmend";
import ViewTransferRequest from "./pages/SLMP-requests/Transfer/ViewTransferRequest";
import EndorseTransferRequest from "./pages/SLMP-requests/Transfer/EndorseTransferRequest";
import ApproveTransferRequests from "./pages/SLMP-requests/Transfer/ApproveTransferRequests";
import FormTransferAmend from "./pages/SLMP-requests/Transfer/FormTransferAmend";
import AcceptTransferRequest from "./AcceptTransferRequest";
import FormTransferAccept from "./pages/SLMP-requests/Transfer/FormTransferAccept";
import ViewDeleteRequest from "./pages/SLMP-requests/Delete/ViewDeleteRequest";
import EndorseDeleteRequest from "./pages/SLMP-requests/Delete/EndorseDeleteRequest";
import FormDeleteAmend from "./pages/SLMP-requests/Delete/FormDeleteAmend";
import AdminViewAll from "./pages/AdminViewAll";
import { useUser } from "./UserContext";
import Login from "./pages/Login";
import { useEffect } from "react";

/*
Contains all the routes needed in the application
VerifyID, VerifyRoles and AcceptTransferRequest are all intermediary checks to ensure that the correct user with the correct privileges are allowed to access certain links
*/

const AppRoutes = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      return navigate("/login");
    }
  }, [user]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/requests" element={<Requests />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/slmp-install" element={<SLMPInstall />} />
      <Route path="/slmp-transfer" element={<SLMPTransfer />} />
      <Route path="/slmp-delete" element={<SLMPDelete />} />
      <Route path="/form-submitted" element={<FormSubmitted />} />
      <Route path="/view-request/:id" element={<ViewRequest />} />
      <Route
        path="/view-transfer-request/:id"
        element={<ViewTransferRequest />}
      />
      <Route path="/view-delete-request/:id" element={<ViewDeleteRequest />} />
      <Route
        path="/endorse-request/:id"
        element={
          <VerifyRole
            element={<EndorseRequest />}
            requiredRole={[
              "Endorsing Officer",
              "Approving Officer",
              "Administrator",
            ]}
          />
        }
      />
      <Route
        path="/approve-request/:id"
        element={
          <VerifyRole
            element={<ApproveRequests />}
            requiredRole={["Approving Officer", "Administrator"]}
          />
        }
      />
      <Route path="/unauthorized" element={<UnauthorizedAccess />} />
      <Route path="/form-endorsed" element={<FormEndorsed />} />
      <Route path="/form-approved" element={<FormApproved />} />
      <Route path="/request-rejected" element={<RequestRejected />} />
      <Route
        path="/amend-request/:id"
        element={<VerifyID element={<FormAmend />} />}
      />
      <Route
        path="/endorse-transfer-request/:id"
        element={
          <VerifyRole
            element={<EndorseTransferRequest />}
            requiredRole={[
              "Endorsing Officer",
              "Approving Officer",
              "Administrator",
            ]}
          />
        }
      />
      <Route
        path="/approve-transfer-request/:id"
        element={
          <VerifyRole
            element={<ApproveTransferRequests />}
            requiredRole={["Approving Officer", "Administrator"]}
          />
        }
      />
      <Route
        path="/amend-transfer-request/:id"
        element={<VerifyID element={<FormTransferAmend />} />}
      />
      <Route
        path="/approve-accept-request/:id"
        element={<AcceptTransferRequest element={<FormTransferAccept />} />}
      />
      <Route
        path="/endorse-delete-request/:id"
        element={
          <VerifyRole
            element={<EndorseDeleteRequest />}
            requiredRole={[
              "Endorsing Officer",
              "Approving Officer",
              "Administrator",
            ]}
          />
        }
      />
      <Route
        path="/amend-delete-request/:id"
        element={<VerifyID element={<FormDeleteAmend />} />}
      />
      <Route
        path="/viewallreq"
        element={
          <VerifyRole
            element={<AdminViewAll />}
            requiredRole={["Administrator"]}
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
