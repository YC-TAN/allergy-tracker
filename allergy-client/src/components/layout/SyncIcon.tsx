import {
  CloudOffOutlined,
  CloudDoneOutlined,
  SyncOutlined,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { useAuthLoading, useIsSignedIn } from "../../stores/useAuthStore";
import useSyncStore from "../../stores/useSyncStore";

/**
 * Renders a cloud-or-sync status icon that reflects the
 * synchronization activity in the AppBar.
 */
const SyncIcon = () => {
  const isSignedIn = useIsSignedIn();
  const userIsPending = useAuthLoading();
  const { status } = useSyncStore();

  if (userIsPending) return <CircularProgress size={20} color="inherit" />;
  if (status === "syncing") return <SyncOutlined className="animate-spin" />;

  return isSignedIn ? <CloudDoneOutlined /> : <CloudOffOutlined />;
};

export default SyncIcon;