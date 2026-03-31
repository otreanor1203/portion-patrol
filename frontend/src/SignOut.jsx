import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import { redirect } from "react-router-dom";

const SignOutButton = () => {
  const { setCurrentUser } = useContext(AuthContext);

  const doSignOut = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/signout",
        {
          method: "POST",
          credentials: "include",
        }
      );
      setCurrentUser(null);
      redirect("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <button type="button" onClick={doSignOut}>
      Sign Out
    </button>
  );
};

export default SignOutButton;
