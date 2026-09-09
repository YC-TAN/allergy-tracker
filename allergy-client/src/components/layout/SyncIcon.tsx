import type { User } from "@supabase/supabase-js";
import {
  CloudOffOutlined,
  CloudDoneOutlined,
  SyncOutlined,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

/**
 * Props passed to the sync status icon component.
 */
interface SyncIconProps {
  /** The currently loaded Supabase user, or null while signed out. */
  user: User | null | undefined;
  /** True while the session lookup is still pending. */
  userIsPending: boolean;
  /** True while the sync operation is in progress. */
  isSyncing: boolean;
}

/**
 * Renders a cloud-or-sync status icon that reflects the
 * synchronization activity in the AppBar.
 */
const SyncIcon = ({ user, userIsPending, isSyncing }: SyncIconProps) => {
  if (userIsPending) return <CircularProgress size={20} color="inherit" />;
  if (isSyncing) return <SyncOutlined className="animate-spin" />;

  return user ? <CloudDoneOutlined /> : <CloudOffOutlined />;
};

export default SyncIcon;