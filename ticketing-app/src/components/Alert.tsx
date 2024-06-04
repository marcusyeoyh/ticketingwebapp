interface alertProp {
  closeAlert: () => void;
}

const Alert = ({ closeAlert }: alertProp) => {
  return (
    <div
      className="alert alert-warning alert-dismissible fade show"
      role="alert"
    >
      <strong>Holy guacamole!</strong> You should check in on some of those
      fields below.
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        onClick={closeAlert}
      ></button>
    </div>
  );
};

export default Alert;
