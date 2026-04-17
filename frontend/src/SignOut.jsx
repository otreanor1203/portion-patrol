import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "./api.js";

const SignOutButton = () => {
  const navigate = useNavigate();
  const { setCurrentUser, csrfToken, refreshCsrfToken } =
    useContext(AuthContext);

  const doSignOut = async () => {
    try {
      if (!csrfToken) {
        console.error("CSRF token missing. Please refresh and try again.");
        return;
      }

      const response = await fetch(apiUrl("/signout"), {
        method: "POST",
        credentials: "include",
        headers: {
          "x-csrf-token": csrfToken,
        },
      });

      if (!response.ok) {
        throw new Error("Sign out failed");
      }

      setCurrentUser(null);
      await refreshCsrfToken();
      navigate("/");
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
