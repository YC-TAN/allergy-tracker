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