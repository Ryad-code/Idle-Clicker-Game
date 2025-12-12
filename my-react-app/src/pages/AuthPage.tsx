import { useState } from 'react';
import { supabase } from '../supabaseClient';
import styled from 'styled-components';

const AuthContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at 20% 20%, #222 0, #111 50%, #0b0b0b 100%);
  color: #f5f5f5;
`;

const FormCard = styled.div`
  width: 360px;
  padding: 24px;
  border-radius: 16px;
  background: #151515;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  gap: 14px;
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

const Title = styled.h2`
  margin: 0 0 4px;
  font-size: 24px;
  font-weight: 700;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #d0d0d0;
`;

const Input = styled.input`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #f5f5f5;
  font-size: 15px;
  outline: none;
  transition: border-color 120ms ease, box-shadow 120ms ease, background 120ms ease;

  &:focus {
    border-color: #5dd0ff;
    box-shadow: 0 0 0 3px rgba(93, 208, 255, 0.2);
    background: rgba(255, 255, 255, 0.06);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 4px;
`;

const Button = styled.button<{ variant?: 'ghost' | 'solid' }>`
  flex: 1;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid
    ${({ variant }) => (variant === 'ghost' ? 'rgba(255, 255, 255, 0.25)' : '#5dd0ff')};
  background: ${({ variant }) => (variant === 'ghost' ? 'transparent' : 'linear-gradient(135deg, #5dd0ff, #4ba3f5)')};
  color: ${({ variant }) => (variant === 'ghost' ? '#e0e0e0' : '#0b0b0b')};
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 100ms ease, box-shadow 120ms ease, background 150ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
  }
`;

const Message = styled.div<{ tone?: 'error' | 'success' }>`
  font-size: 14px;
  color: ${({ tone }) => (tone === 'error' ? '#ff8a8a' : '#7ee0a3')};
  min-height: 18px;
`;

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
