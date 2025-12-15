import styled from 'styled-components';
import { theme } from '../../styles/theme';

const ErrorBox = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.radius.md};
  background: #fdecea;
  color: ${theme.colors.error};
  border: 1px solid ${theme.colors.error}33;
`;

const ErrorIcon = styled.span`
  font-size: 1.2rem;
`;

const ErrorText = styled.div`
  font-size: ${theme.typography.fontSize.base};
`;

interface Props {
  message: string;
}

export default function ErrorMessage({ message }: Props) {
  if (!message) return null;
  return (
    <ErrorBox role="alert" aria-live="polite">
      <ErrorIcon>⚠️</ErrorIcon>
      <ErrorText>{message}</ErrorText>
    </ErrorBox>
  );
}
