import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { AuthContainer, FormCard, AuthInput, AuthButton } from '../styles/components';
import { theme } from '../styles/theme';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSignup() {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else{
      setMessage('Signup successful! Check your email.');
    }
  }

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else {
      setMessage('Login successful!');
    }
  }

  return (
    <AuthContainer>
      <FormCard>
        <h2 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 700 }}>Login / Signup</h2>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', color: theme.colors.text }}>
          Email
          <AuthInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', color: theme.colors.text }}>
          Password
          <AuthInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </label>

        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
          <AuthButton onClick={handleLogin}>
            Login
          </AuthButton>
          <AuthButton $variant="ghost" onClick={handleSignup}>
            Signup
          </AuthButton>
        </div>

        <div style={{ 
          fontSize: '14px', 
          color: message.toLowerCase().includes('error') ? theme.colors.danger : theme.colors.success,
          minHeight: '18px'
        }}>
          {message}
        </div>
      </FormCard>
    </AuthContainer>
  );
}
