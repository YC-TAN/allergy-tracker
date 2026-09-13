import { Card, CardContent, type SxProps, type Theme } from "@mui/material";

interface BaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  backgroundColor?: string;
}

const BaseCard = ({
  children,
  sx,
  backgroundColor,
  ...props
}: BaseCardProps) => {
  return (
    <Card
      // variant={variant}
      className="mb-3 w-full"
      sx={{
        backgroundColor: backgroundColor || "background.paper",
        ...sx
      }}
      {...props}
    >
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default BaseCard;
