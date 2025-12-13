import { useState } from 'react';
import { supabase } from '../supabaseClient';
import {
  AuthContainer,
  FormCard,
  Title,
  Label,
  Input,
  ButtonRow,
  Button,
  Message
} from '../styles/components/authPage.styles';

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
      <FormCard>
        <Title>Login / Signup</Title>

        <Label>
          Email
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Label>

        <Label>
          Password
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </Label>

        <ButtonRow>
          <Button onClick={handleLogin}>
            Login
          </Button>
          <Button variant="ghost" onClick={handleSignup}>
            Signup
          </Button>
        </ButtonRow>

        <Message tone={message.toLowerCase().includes('error') ? 'error' : 'success'}>
          {message}
        </Message>
      </FormCard>
    </AuthContainer>
  );
}
