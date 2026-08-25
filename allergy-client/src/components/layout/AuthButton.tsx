import { IconButton } from "@mui/material";
import { LogoutOutlined, LoginOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const AuthButton = () => {
  const { user, userIsPending, signOut } = useAuth();
  const navigate = useNavigate();

  if (userIsPending) return null; // avoid a flash of the wrong button while session loads

  return user ? (
    <IconButton color="inherit" onClick={() => signOut()} aria-label="log out">
      <LogoutOutlined />
    </IconButton>
  ) : (
    <IconButton color="inherit" onClick={() => navigate("/login")} aria-label="log in">
      <LoginOutlined />
    </IconButton>
  );
};

export default AuthButton;