/**
 * DailyLog displays today's saved symptom entry on the Homepage.
 *
 * It shows either a symptom-free summary or the recorded severity, symptoms,
 * notes, and allows the user to edit the existing log.
 */

import { Button, Typography } from "@mui/material";
import { EditOutlined } from "@mui/icons-material";
import { useEntry } from "../../hooks/useEntry";
import { SeverityLabel } from "../../schemas/labels";
import { Link } from "react-router-dom";
import BaseCard from "../ui/BaseCard";

const DailyLog = () => {
  const { entry, isPending } = useEntry();

  if (isPending) return <div>loading...</div>;
  if (!entry) return null;

  const symptoms = entry.symptoms?.length > 0 ? ": " + entry.symptoms.join(", ") : "";

  const message =
    entry.severity === 0
      ? "No symptoms"
      : `${SeverityLabel[entry.severity]}${symptoms}`;

  return (
    // <div className="flex flex-col items-center px-5 pt-8 pb-6">
    <>
      <div className="text-center mb-6 flex-1">
        <div
          aria-hidden="true"
          className=""
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#f0f7f0",
            border: "2px solid #a5d6a7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            margin: "0 auto 1.25rem",
          }}
        >
          🌿
        </div>
      </div>
      <BaseCard>
          {message}
        <Typography variant="body2" className="mb-2 text-center">
          {entry?.notes?.length > 0 ? `Notes: ${entry.notes}` : ""}
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
      </BaseCard>
    </>
  );
};

export default DailyLog;
