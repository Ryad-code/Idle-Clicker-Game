import { Outlet } from "react-router-dom";
import Header from "./Header";
import { LayoutContainer } from "../../styles/components/layout.styles";

function Layout() {
  return (
    <LayoutContainer>
      <Header />
      <Outlet />
    </LayoutContainer>
  );
}

export default Layout;
