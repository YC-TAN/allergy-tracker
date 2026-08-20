import { Box, Typography } from "@mui/material";
import Login from "../components/Login";
import Logout from "../components/Logout";
import {useAuth} from "../hooks/useAuth";

const LoginPage = () => {
    const {user} = useAuth();

    if (user) {
        return (
        <Box className="flex flex-col gap-4 p-6">
        <Typography variant="h6">Account</Typography>
        <Typography>Signed in as {user.email}</Typography>
        <Typography variant="body2" color="text.secondary">
          Your entries are syncing to the server.
        </Typography>
        <Logout />
      </Box>
        )
    }
    return (
        <Login />
    )
}

export default LoginPage