/**
 * NotesCard renders an optional notes input field used in the symptom entry form.
 *
 * It captures extra details for today's log and updates parent form state.
 */
import { TextField } from "@mui/material";
import type React from "react";
import BaseCard from "../ui/BaseCard";
import CardTitle from "../ui/CardTitle";

interface NotesProps {
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
}

const NotesCard = ({ notes, setNotes }: NotesProps) => {
  return (
    <BaseCard>
      <CardTitle title="Notes" optional={true} />
      <TextField
        multiline
        rows={3}
        fullWidth
        className="md:px-[5%]"
        placeholder="e.g. took antihistamine, windows open all day, pets, indoor drying, air purifier…"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        slotProps={{
          input: { inputProps: { "aria-label": "Additional notes" } },
        }}
      />
    </BaseCard>
  );
};

export default NotesCard;
