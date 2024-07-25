import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import NavBar from "../components/NavBar";
import UserProfile from "../components/user-attributes/UserProfile";

// Profile page for the currently logged in user

const Profile = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const handleClick = () => {
    setUser(null);
    navigate("/login");
  };
  return (
    <>
      <NavBar />
      <UserProfile />
      <button
        type="submit"
        className="btn btn-danger"
        style={{ margin: "1rem" }}
        onClick={() => {
          handleClick();
        }}
      >
        Log Out
      </button>
    </>
  );
};

export default Profile;
