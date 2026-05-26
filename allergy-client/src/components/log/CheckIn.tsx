import { Card, CardContent, Button, Typography } from "@mui/material";
import { ThumbUpOutlined, AddOutlined } from "@mui/icons-material";

interface CheckInProps {
  onAllGood: () => void;
  onLogSymptoms: () => void;
}

const CheckIn = ({ onAllGood, onLogSymptoms }: CheckInProps) => {
  return (
    <div className="flex flex-col items-center px-5 pt-8 pb-6">
      {/* Headline */}
      <div className="text-center mb-6">
        <Typography variant="h5" gutterBottom>
          How's the pollen
          <br />
          treating you today?
        </Typography>
      </div>

      {/* CTA card */}
      <Card className="w-full">
        <CardContent className="flex flex-col gap-3 p-5">
          <Typography variant="body2" className="mb-4">
            Tap below to record today's symptoms, or mark it as a symptom-free
            day.
          </Typography>

          {/* All good — records severity 0 */}
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<ThumbUpOutlined />}
            onClick={onAllGood}
          >
            All good — no symptoms
          </Button>

          {/* Log — opens LogForm */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<AddOutlined />}
            onClick={onLogSymptoms}
          >
            Log my symptoms
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckIn;
