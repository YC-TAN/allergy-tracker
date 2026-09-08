import { Card, CardContent, Typography } from "@mui/material";

interface BaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  cardHeader: string;
  children: React.ReactNode;
  optional: boolean;
}

const BaseCard = ({
  cardHeader,
  children,
  optional = false,
}: BaseCardProps) => {
  return (
    <Card className="mb-4 w-full">
      <CardContent>
        <Typography variant="subtitle1" className="block mb-2.5">
          {cardHeader + " "}
          {optional && (
            <Typography
              component="span"
              variant="subtitle1"
              sx={{
                fontWeight: 400,
                textTransform: 'none',
              }}
            >
              (optional)
            </Typography>
          )}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
};

export default BaseCard;
