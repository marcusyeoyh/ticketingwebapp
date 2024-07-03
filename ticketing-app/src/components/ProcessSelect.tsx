import React from "react";
import "./ProcessSelect.css";
import { NavLink } from "react-router-dom";

const ProcessSelect = () => {
  return (
    <div className="list-group">
      <a
        href="#"
        className="list-group-item list-group-item-action list-group-item-custom"
        aria-current="true"
        data-bs-toggle="collapse"
        data-bs-target="#SLMPCollapse"
        aria-expanded="false"
        aria-controls="SLMP Collapsible"
      >
        <i className="bi bi-code-square icon-large"></i>
        <div>
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">Software License Management Process</h5>
          </div>
          <p className="mb-1">Install, Transfer or Delete a Software License</p>
        </div>
      </a>
      <div className="collapse" id="SLMPCollapse">
        <div className="card card-body">
          <div>
            <p>
              <NavLink className="nav-link" to="/slmp-install">
                Request to install new software license
              </NavLink>
            </p>
            <p>
              <NavLink className="nav-link" to="/slmp-transfer">
                Request to transfer software license
              </NavLink>
            </p>
            <p>
              <NavLink className="nav-link" to="/slmp-delete">
                Request to remove license
              </NavLink>
            </p>
          </div>
        </div>
      </div>
      <a
        href="#"
        className="list-group-item list-group-item-action list-group-item-custom"
      >
        <i className="bi bi-pc-display icon-large"></i>
        <div>
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">IT Assets Management Process</h5>
          </div>
          <p className="mb-1">Manage IT Assets</p>
        </div>
      </a>
      <a
        href="#"
        className="list-group-item list-group-item-action list-group-item-custom"
      >
        <i className="bi bi-envelope-open-heart icon-large"></i>
        <div>
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">Enquiry and Feedback</h5>
          </div>
          <p className="mb-1">Give us some feedback!</p>
        </div>
      </a>
    </div>
  );
};

export default ProcessSelect;
