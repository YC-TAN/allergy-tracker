import { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const { signIn, isSigningIn, signInError, signInSent } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(email);
  };

  if (signInSent) {
    return (
      <Box className="flex flex-col items-center gap-2 p-6">
        <Typography>Check your email for the sign-in link.</Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
      <Typography variant="h6">Sign in</Typography>
      <TextField
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {signInError && <Alert severity="error">{signInError.message}</Alert>}
      <Button type="submit" variant="contained" disabled={isSigningIn}>
        {isSigningIn ? 'Sending…' : 'Send magic link'}
      </Button>
    </Box>
  );
}

export default Login;