import React from "react";
import NavBar from "./NavBar";

const Layout = ({ children }) => {
  return (
    <div>
      <NavBar />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
};

export default Layout;
