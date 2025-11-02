import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { TextField, Button, Stack, Typography } from '@mui/material';
import styled from 'styled-components';

const AuthContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSignup() {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else{
      setMessage('Signup successful! Check your email.');
      console.log("Signup data: ", data)
    }
  }

  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else {
      setMessage('Login successful!');
      console.log("login data: ", data)
    }
  }

  return (
    <AuthContainer>
    <h1>Rev</h1>
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
    </AuthContainer>
  );
}
