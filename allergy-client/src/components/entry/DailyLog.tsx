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

const DailyLog = () => {
  const { entry, isPending } = useEntry();
  
  if (isPending) return <div>loading...</div>;
  if (!entry) return null

  return (
    <div className="flex flex-col items-center px-5 pt-8 pb-6">
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
          {/* 😃 */}
        </div>
        {entry?.severity === 0 ? (
          <>
            <Typography variant="h5" gutterBottom>
              No hay fever today.
            </Typography>
            <Typography variant="body2">Logged as no symptoms.</Typography>
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Symptoms: {entry?.severity && SeverityLabel[entry.severity]}
            </Typography>
            <Typography variant="body2">
              {entry?.symptoms?.length > 0 && entry?.symptoms.join(", ")}              
              <br/>
              {entry?.notes}
            </Typography>
          </>
        )}
      </div>
      {/* Edit entry */}
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        startIcon={<EditOutlined />}
        component={Link}
        to={`/log/${entry.date}`}
      >
        Edit Log
      </Button>
    </div>
  );
};

export default DailyLog;
