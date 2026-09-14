import { Button } from "@mui/material";
import ErrorTypography from "./ErrorTypography";

interface ErrorFallbackProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorFallback({
  message="Oops... Something went wrong...",
  onRetry,
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
      <ErrorTypography message={message} />
      {onRetry && (
        <Button size="small" variant="outlined" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}