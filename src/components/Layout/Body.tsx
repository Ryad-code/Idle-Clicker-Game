import type { ReactNode } from "react";

interface BodyProps {
  children?: ReactNode;
}

function Body({ children }: BodyProps) {
  return <main className="flex-1 overflow-auto">{children}</main>;
}

export default Body;
