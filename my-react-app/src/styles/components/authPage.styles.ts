import styled from 'styled-components';

export const AuthContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at 20% 20%, #222 0, #111 50%, #0b0b0b 100%);
  color: #f5f5f5;
`;

export const FormCard = styled.div`
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

export const Title = styled.h2`
  margin: 0 0 4px;
  font-size: 24px;
  font-weight: 700;
`;

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #d0d0d0;
`;

export const Input = styled.input`
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

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 4px;
`;

export const Button = styled.button<{ variant?: 'ghost' | 'solid' }>`
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

export const Message = styled.div<{ tone?: 'error' | 'success' }>`
  font-size: 14px;
  color: ${({ tone }) => (tone === 'error' ? '#ff8a8a' : '#7ee0a3')};
  min-height: 18px;
`;
