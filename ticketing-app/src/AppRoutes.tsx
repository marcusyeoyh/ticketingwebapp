import HomePage from "./pages/Homepage";
import Requests from "./pages/Requests";
import { Route, Routes } from "react-router-dom";
import Profile from "./pages/Profile";
import SLMPInstall from "./pages/SLMP-requests/SLMPInstall";
import SLMPDelete from "./pages/SLMP-requests/Delete/SLMPDelete";
import SLMPTransfer from "./pages/SLMP-requests/Transfer/SLMPTransfer";
import FormSubmitted from "./pages/SLMP-requests/FormSubmitted";
import ViewRequest from "./pages/SLMP-requests/ViewRequest";
import EndorseRequest from "./pages/EndorseRequest";
import VerifyRole from "./VerifyRole";
import UnauthorizedAccess from "./pages/UnauthorizedAccess";
import FormEndorsed from "./pages/SLMP-requests/FormEndorsed";
import ApproveRequests from "./pages/SLMP-requests/ApproveRequests";
import FormApproved from "./pages/SLMP-requests/FormApproved";
import RequestRejected from "./pages/SLMP-requests/RequestRejected";
import VerifyID from "./VerifyID";
import FormAmend from "./pages/SLMP-requests/FormAmend";
import ViewTransferRequest from "./pages/SLMP-requests/Transfer/ViewTransferRequest";
import EndorseTransferRequest from "./pages/SLMP-requests/Transfer/EndorseTransferRequest";
import ApproveTransferRequests from "./pages/SLMP-requests/Transfer/ApproveTransferRequests";
import AmendTransferRequest from "./AmendTransferRequest";
import FormTransferAmend from "./pages/SLMP-requests/Transfer/FormTransferAmend";
import AcceptTransferRequest from "./AcceptTransferRequest";
import FormTransferAccept from "./pages/SLMP-requests/Transfer/FormTransferAccept";
import ViewDeleteRequest from "./pages/SLMP-requests/Delete/ViewDeleteRequest";
import EndorseDeleteRequest from "./pages/SLMP-requests/Delete/EndorseDeleteRequest";
import FormDeleteAmend from "./pages/SLMP-requests/Delete/FormDeleteAmend";

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
        path="/view-transfer-request/:id"
        element={<ViewTransferRequest />}
      />
      <Route path="/view-delete-request/:id" element={<ViewDeleteRequest />} />
      <Route
        path="/endorse-request/:id"
        element={
          <VerifyRole
            element={<EndorseRequest />}
            requiredRole={["Endorsing Officer", "Approving Officer"]}
          />
        }
      />
      <Route
        path="/approve-request/:id"
        element={
          <VerifyRole
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
        element={<VerifyID element={<FormAmend />} />}
      />
      <Route
        path="/endorse-transfer-request/:id"
        element={
          <VerifyRole
            element={<EndorseTransferRequest />}
            requiredRole={["Endorsing Officer", "Approving Officer"]}
          />
        }
      />
      <Route
        path="/approve-transfer-request/:id"
        element={
          <VerifyRole
            element={<ApproveTransferRequests />}
            requiredRole={["Approving Officer"]}
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
            requiredRole={["Endorsing Officer", "Approving Officer"]}
          />
        }
      />
      <Route
        path="/amend-delete-request/:id"
        element={<VerifyID element={<FormDeleteAmend />} />}
      />
    </Routes>
  );
};

export default AppRoutes;
