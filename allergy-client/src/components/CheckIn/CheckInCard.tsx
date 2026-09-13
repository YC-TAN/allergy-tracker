/**
 * CheckIn renders the quick daily check-in card shown on the Homepage.
 *
 * Users can mark today as symptom-free or navigate to the symptom entry form.
 */
import { Button, Typography } from "@mui/material";
import { AddOutlined, EditOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useEntry } from "../../hooks/useEntry";
import { SeverityLabel } from "../../schemas/labels";
import BaseCard from "../ui/BaseCard";
import LeafGraphic from "../ui/LeafGraphic";
import ProgressBox from "../ui/ProgressBox";
import ErrorTypography from "../ui/ErrorTypography";

const CheckInCard = () => {
  const { entry, isPending, isError, error } = useEntry();

  const renderContent = () => {
    if (isPending) return <ProgressBox />;
    if (isError) {
      console.error("Entry fetch failed:", error);
      return <ErrorTypography message="Couldn't load today's entry..." />;
    }
    if (!entry) {
      return (
        <>
          <Typography
            variant="body1"
            className="mb-4 text-center"
          >
            How's today been?
          </Typography>
          {/* Create new entry */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<AddOutlined />}
            component={Link}
            to="/entry"
          >
            Log today's symptoms
          </Button>
        </>
      );
    }

    const symptoms =
      entry.symptoms?.length > 0 ? " - " + entry.symptoms.join(", ") : "";
    const message =
      entry.severity === 0
        ? "No symptoms"
        : `${SeverityLabel[entry.severity]}${symptoms}`;

    return (
      <>
        <Typography variant="body1" className="text-center">
          {message}
        </Typography>
        <Typography variant="body2" color="textSecondary" className="text-center">
          {entry?.notes?.length > 0 ? `Notes: ${entry.notes}` : ""}
        </Typography>
        <Typography variant="body2" color="textSecondary" className="mb-4 text-center">
          {entry?.honey && "Taken honey"}
        </Typography>
        {/* Edit entry */}
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          startIcon={<EditOutlined />}
          component={Link}
          to={`/entry/${entry.date}`}
        >
          Edit Log
        </Button>
      </>
    );
  };
  return (
    <>
      {/* Core Action Card */}
      <BaseCard>
        <LeafGraphic />
        {renderContent()}
        {/* <Typography
          variant="body1"
          color="textSecondary"
          className="mb-4 text-center"
        >
          How's today been?
        </Typography>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<AddOutlined />}
          component={Link}
          to="/entry"
        >
          Log today's symptoms
        </Button> */}
      </BaseCard>
    </>
  );
};

export default CheckInCard;
