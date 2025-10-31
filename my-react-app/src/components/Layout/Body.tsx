import type { ReactNode } from "react";
import styled from "styled-components";

const BodyContainer = styled.main`
  background-color: white;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: center;
  padding-top: 50px;;
`;

interface BodyProps {
  children?: ReactNode;
}

function Body({ children }: BodyProps) {
  return <BodyContainer>{children}</BodyContainer>;
}

export default Body;
