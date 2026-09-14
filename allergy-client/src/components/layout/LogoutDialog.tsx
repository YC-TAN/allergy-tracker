import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface LogoutDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutDialog = ({ open, onClose, onConfirm }: LogoutDialogProps) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Log out?</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Any unsynced entries on this device will stay saved locally and sync next time you sign in.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary" variant="contained">
        Cancel
      </Button>
      <Button onClick={onConfirm} color="error" variant="outlined">
        Log out
      </Button>
    </DialogActions>
  </Dialog>
);

export default LogoutDialog;