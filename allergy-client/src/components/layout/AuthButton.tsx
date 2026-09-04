import { BottomNavigationAction } from "@mui/material";
import { LoginOutlined, LogoutOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const AuthButton = () => {
  const { user, userIsPending, signOut } = useAuth();
  // const navigate = useNavigate();

  if (userIsPending) return null; // avoid a flash of the wrong button while session loads

  return user ? (
    <BottomNavigationAction label="Logout" icon={<LogoutOutlined />} onClick={() => {
    if (window.confirm("Log out?")) signOut();
  }} />
    // <IconButton color="inherit" onClick={() => signOut()} aria-label="log out">
    //   <CloudDoneOutlined />     
    // </IconButton>
  ) : (
    <BottomNavigationAction label="Login" icon={<LoginOutlined />} component={Link} to="/login" />
    // <IconButton color="inherit" onClick={() => navigate("/login")} aria-label="log in">
    //   <CloudOffOutlined />
    // </IconButton>
  );
};

export default AuthButton;