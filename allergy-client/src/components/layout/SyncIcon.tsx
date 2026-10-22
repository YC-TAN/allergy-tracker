import {
  CloudOffOutlined,
  CloudDoneOutlined,
  SyncOutlined,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { useAuthLoading, useIsSignedIn } from "../../stores/useAuthStore";

/**
 * Props passed to the sync status icon component.
 */
interface SyncIconProps {
  /** True while the sync operation is in progress. */
  isSyncing: boolean;
}

/**
 * Renders a cloud-or-sync status icon that reflects the
 * synchronization activity in the AppBar.
 */
const SyncIcon = ({ isSyncing }: SyncIconProps) => {
  const isSignedIn = useIsSignedIn();
  const userIsPending = useAuthLoading();
  if (userIsPending) return <CircularProgress size={20} color="inherit" />;
  if (isSyncing) return <SyncOutlined className="animate-spin" />;

  return isSignedIn ? <CloudDoneOutlined /> : <CloudOffOutlined />;
};

export default SyncIcon;