import { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const { signIn, isSigningIn, signInError, signInSent } = useAuth();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    signIn(email);
  };

  if (signInSent) {
    return (
      <div className="flex flex-col items-center">
        <Typography>Check your email for the sign-in link.</Typography>
      </div>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="flex flex-col item-center gap-4
      w-full"
    >
      <TextField
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        sx={{
          backgroundColor: "background.paper",
        }}
      />
      {signInError && <Alert severity="error">{signInError.message}</Alert>}
      <Button type="submit" variant="contained" disabled={isSigningIn}>
        {isSigningIn ? "Sending…" : "Send magic link"}
      </Button>
    </Box>
  );
};

export default Login;
