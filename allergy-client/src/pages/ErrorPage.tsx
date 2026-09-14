import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import ErrorTypography from "../components/ui/ErrorTypography";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Oops... Something went wrong";

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 px-6 text-center">
      <ErrorTypography message={message} />
      <Button variant="contained" onClick={() => navigate("/")}>
        Back to home
      </Button>
    </div>
  );
};

export default ErrorPage;