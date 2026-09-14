/**
 * NotFoundPage renders when the user navigates to an unknown route.
 * 
 * It is used by the /* route in the app router as a fallback path.
 */
import {Typography, Button} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorTypography from "../components/ui/ErrorTypography";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 px-6 text-center">
      <Typography variant="h3" sx={{ fontWeight: 700 }}>
        404
      </Typography>
      <ErrorTypography message="This page does not exist ..."/>
      <Button variant="contained" onClick={() => navigate("/")}>
        Back to home
      </Button>
    </div>
  )
}

export default NotFoundPage;
