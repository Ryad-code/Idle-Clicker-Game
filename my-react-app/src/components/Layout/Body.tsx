import type { ReactNode } from "react";
import { BodyContainer } from "../../styles/components/layout.styles";

interface BodyProps {
  children?: ReactNode;
}

function Body({ children }: BodyProps) {
  return <BodyContainer>{children}</BodyContainer>;
}

export default Body;
