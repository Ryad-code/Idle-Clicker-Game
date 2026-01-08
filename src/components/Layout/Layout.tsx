import { Outlet } from "react-router-dom";
import Header from "./Header";

function Layout() {
  return (
    <div className="h-screen w-screen flex flex-col text-foreground">
      <Header />
      <Outlet />
    </div>
  );
}

export default Layout;
