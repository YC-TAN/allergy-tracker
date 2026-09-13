import { Typography } from "@mui/material";

interface ErrorTypographyProps {
  message?: string;
}

const ErrorTypography = ({
  message="Oops... Something went wrong...",
}: ErrorTypographyProps) => {
  return <Typography variant="body1">{message}</Typography>;
};

export default ErrorTypography;
