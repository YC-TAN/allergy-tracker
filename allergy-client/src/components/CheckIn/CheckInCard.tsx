/**
 * CheckInCard renders prompt and button to EntryForm if no entry recorded today.
 * Otherwise it renders today's record and Edit button.
 *
 */
import { Button, Typography } from "@mui/material";
import { AddOutlined, EditOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useEntry } from "../../hooks/useLocalEntries";
import { SeverityLabel } from "../../schemas/labels";
import BaseCard from "../ui/BaseCard";
import LeafGraphic from "../ui/LeafGraphic";
import ProgressBox from "../ui/ProgressBox";
import { useAuthLoading, useIsSignedIn } from "../../stores/useAuthStore";
import useSyncStore from "../../stores/useSyncStore";

const CheckInCard = () => {
  const authLoading = useAuthLoading();
  const isSignedIn = useIsSignedIn();
  const {hydrated} = useSyncStore();
  const entry = useEntry();

  const renderContent = () => {
    if (entry === undefined) return <ProgressBox />;
    if (entry === null && (authLoading || (isSignedIn && !hydrated))) return <ProgressBox />;
    // TODO: Render syncing
    
    if (entry === null) {
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
      </BaseCard>
    </>
  );
};

export default CheckInCard;
