/**
 * NotesCard renders an optional notes input field used in the symptom entry form.
 * 
 * It captures extra details for today's log and updates parent form state.
 */
import { Box, Card, CardContent, Typography, TextField } from "@mui/material";
import type React from "react";

interface NotesProps {
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
}

const NotesCard = ({ notes, setNotes }: NotesProps) => {
  return (
    <Card className="mb-4">
      <CardContent>
        <Typography
          variant="caption"
          className="block mb-2"
          sx={{
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Notes{" "}
          <Box
          component="span"
          sx={{
              fontWeight: 400,
              textTransform: "none",
              letterSpacing: 0,
              color: "#7a9e77",
            }}
          >
            (optional)
          </Box>
        </Typography>

        <TextField
          multiline
          rows={3}
          fullWidth
          placeholder="e.g. took antihistamine, windows open all day, pets, indoor drying, air purifier…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          slotProps={{
            input: { inputProps: { "aria-label": "Additional notes" } },
          }}
        />
      </CardContent>
    </Card>
  );
};

export default NotesCard;
