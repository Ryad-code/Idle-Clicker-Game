import { useEffect, useState } from 'react';
import { loadFromLocalStorage, saveToLocalStorage } from '../localStorage/localStorage';

interface User {
  id: string;
  email: string;
}

const AUTH_KEY = 'current_user';

export function useAuth() {
  // undefined → still loading, null → not logged in, User → logged in
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    // Load current user from localStorage
    const savedUser = loadFromLocalStorage<User>(AUTH_KEY);
    setUser(savedUser);
  }, []);

  return user;
}

export function login(email: string, password: string): boolean {
  // Simple localStorage-based auth (no real authentication)
  // In production, you'd validate credentials against a backend
  if (email && password) {
    const user: User = {
      id: email, // Use email as unique ID
      email: email,
    };
    saveToLocalStorage(AUTH_KEY, user);
    return true;
  }
  return false;
}

export function signup(email: string, password: string): boolean {
  // Simple localStorage-based signup
  if (email && password) {
    const user: User = {
      id: email,
      email: email,
    };
    saveToLocalStorage(AUTH_KEY, user);
    return true;
  }
  return false;
}

export function logout(): void {
  saveToLocalStorage(AUTH_KEY, null);
}