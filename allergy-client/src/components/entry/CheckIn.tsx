/**
 * CheckIn renders the quick daily check-in card shown on the Homepage.
 * 
 * Users can mark today as symptom-free or navigate to the symptom entry form.
 */
import { Card, CardContent, Button, Typography } from "@mui/material";
import { ThumbUpOutlined, AddOutlined } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { useEntry } from "../../hooks/useEntry";
import { SeverityRating, type EntryInput } from "../../schemas";
import { useSettings } from "../../hooks/useSettings";

const CheckIn = () => {

  const {save} = useEntry();
  const { settings, settingsIsPending } = useSettings();
  const nav = useNavigate();

  if (settingsIsPending) return <div>loading...</div>;

  const location = settings?.location;

  const handleAllGood = () => {
    const entry: EntryInput = {
      location,
      severity: SeverityRating.NoSymptom,      
    }
    save(entry);
    nav('/');
  }
  return (
    <>
      {/* Headline */}
      <div className="text-center flex-1 mb-6">
        <Typography variant="h5" gutterBottom>
          How's the pollen
          <br />
          treating you today?
        </Typography>
      </div>

      {/* CTA card */}
      <Card className="w-full mb-6">
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
            onClick={handleAllGood}
          >
            All good — no symptoms
          </Button>

          {/* Log — opens LogForm */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<AddOutlined />}
            component={Link}
            to="/log"
          >
            Log my symptoms
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default CheckIn;
