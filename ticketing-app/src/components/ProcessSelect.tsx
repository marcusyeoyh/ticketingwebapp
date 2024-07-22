import "./ProcessSelect.css";
import { NavLink } from "react-router-dom";

// component that shows the different options that the user has to raise processes: Software License Management Process, IT Assets Management Process and Enqiry and Feedback

const ProcessSelect = () => {
  return (
    <div className="d-flex">
      <div className="card">
        <div className="card-body">
          <div className="d-flex align-items-center header">
            <i className="bi bi-code-square icon-large"></i>
            <h5 className="mb-1 title">Software License Management Process</h5>
          </div>
          <h6 className="card-subtitle mb-2 text-body-secondary">
            Install, Transfer or Delete a Software License
          </h6>
          <p className="card-text">
            The Software License Management Process covers the management of the
            software license lifecycle after its acquisition by the Project
            Team. These processes include the software approval, installation,
            tracking, transfer, removal and auditing.
          </p>
          <div className="d-flex justify-content-around">
            {/* link to raise a new SLMP Install request */}
            <div className="d-flex justify-content-center align-items-center">
              <NavLink
                className="nav-link d-flex flex-column align-items-center text-center"
                to="/slmp-install"
              >
                <i className="bi bi-cloud-arrow-down download-icon"></i>
                <span>Install Request</span>
              </NavLink>
            </div>

            {/* link to raise a new SLMP Transfer request */}
            <div className="d-flex justify-content-center align-items-center">
              <NavLink
                className="nav-link d-flex flex-column align-items-center text-center"
                to="/slmp-transfer"
              >
                <i className="bi bi-arrow-left-right"></i>
                <span>Transfer Request</span>
              </NavLink>
            </div>

            {/* link to raise a new SLMP Delete request */}
            <div className="d-flex justify-content-center align-items-center">
              <NavLink
                className="nav-link d-flex flex-column align-items-center text-center"
                to="/slmp-delete"
              >
                <i className="bi bi-trash"></i>
                <span>Remove License</span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* placeholder card for Manage IT Assets requests */}
      <div className="card">
        <div className="card-body d-flex align-items-center">
          <div>
            <div className="d-flex align-items-center header">
              <i className="bi bi-pc-display icon-large"></i>
              <h5 className="mb-1 title">IT Assets Management Process</h5>
            </div>
            <h6 className="card-subtitle mb-2 text-body-secondary">
              Manage IT Assets
            </h6>
            <p className="card-text"></p>
          </div>
        </div>
      </div>

      {/* placeholder card for Enquiry and Feedback requests */}
      <div className="card">
        <div className="card-body d-flex align-items-center">
          <div>
            <div className="d-flex align-items-center header">
              <i className="bi bi-envelope-open-heart icon-large"></i>
              <h5 className="mb-1 title">Enquiry and Feedback</h5>
            </div>
            <h6 className="card-subtitle mb-2 text-body-secondary">
              Give us some feedback!
            </h6>
            <p className="card-text"></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessSelect;
