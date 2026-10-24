/**
 * LogPage renders the entry form and load today's entry into the form if exists.
 *
 * It is used by the /log and /log/:date routes for creating or editing a log.
 */
import { useParams } from "react-router-dom";
import EntryForm from "../components/EntryForm";
import { useEntry } from "../hooks/useLocalEntries";
import PageTitle from "../components/ui/PageTitle";

const EntryFormPage = () => {
  const { date } = useParams<{ date: string }>();
  const entry = useEntry(date);

  return (
  <>
    <PageTitle title="Today's Symptoms" />
    <EntryForm existing={entry} />
  </>
  )
};

export default EntryFormPage;
