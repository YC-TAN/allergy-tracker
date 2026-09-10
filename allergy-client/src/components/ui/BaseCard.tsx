import { 
  Card, 
  CardContent, 
} from "@mui/material";

interface BaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const BaseCard = ({
  children,
}: BaseCardProps) => {
  return (
    <Card className="mb-2 w-full">
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default BaseCard;
