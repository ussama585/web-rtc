import React from "react";
import userAuthStore from "../store/userAuthStore/userAuthStore";
import Navbar from "../components/common/Navbar";

// Pass the child props
export default function Layout({ children }) {
  const user = userAuthStore.getState().user;
  return (
    <div>
      {user && <Navbar />}
      {children}
    </div>
  );
}
