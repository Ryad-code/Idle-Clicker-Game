import styled from "styled-components";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const LayoutContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8; /* light gray background */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

function Layout() {
  return (
    <LayoutContainer>
      <Header />
      <Outlet />
    </LayoutContainer>
  );
}

export default Layout;
