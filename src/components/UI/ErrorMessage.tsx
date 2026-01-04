import styled from 'styled-components';
import { theme } from '../../styles/theme';

const ErrorBox = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: #fdecea;
  color: #cc0000;
  border: 1px solid #cc0000;
`;

const ErrorIcon = styled.span`
  font-size: 18px;
`;

const ErrorText = styled.div`
  font-size: 14px;
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
