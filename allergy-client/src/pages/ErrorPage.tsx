import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import { Typography, Button } from "@mui/material";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Something went wrong";

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 px-6 text-center">
      <Typography variant="h6">
        Oops, something went wrong ...
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {message}
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        Back to home
      </Button>
    </div>
  );
};

export default ErrorPage;