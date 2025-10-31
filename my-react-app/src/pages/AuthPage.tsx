import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { TextField, Button, Stack, Typography } from '@mui/material';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSignup() {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage('Signup successful! Check your email.');
  }

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else setMessage('Login successful!');
  }

  return (
    <Stack spacing={2} maxWidth={360} margin="auto" mt={8}>
      <Typography variant="h5">Login / Signup</Typography>

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />

      <Stack direction="row" spacing={2}>
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login
        </Button>
        <Button variant="outlined" color="primary" onClick={handleSignup}>
          Signup
        </Button>
      </Stack>

      {message && <Typography color="error">{message}</Typography>}
    </Stack>
  );
}
