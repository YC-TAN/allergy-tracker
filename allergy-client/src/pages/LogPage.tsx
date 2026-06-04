/**
 * LogPage renders the entry form and load today's entry into the form if exists.
 * 
 * It is used by the /log and /log/:date routes for creating or editing a log.
 */
import { useParams } from "react-router-dom";
import EntryForm from "../components/entry/EntryForm";
import { useEntry } from "../hooks/useEntry";

const LogPage = () => {
  const { date } = useParams<{ date: string }>();
  const { entry, isPending } = useEntry(date);

  if (isPending) return <div>loading...</div>;

  return <EntryForm existing={entry} />;
};

export default LogPage;