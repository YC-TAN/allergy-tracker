import { Button } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const Logout = () => {
  const { signOut } = useAuth();
  return (
    <Button variant="outlined" color="error" onClick={() => signOut()}>
      Sign out
    </Button>
  );
}
export default Logout;