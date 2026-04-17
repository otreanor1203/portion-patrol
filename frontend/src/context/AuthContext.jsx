import { useState, useEffect, createContext } from "react";
import { apiUrl } from "../api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);

  const refreshCsrfToken = async () => {
    try {
      const csrfResponse = await fetch(apiUrl("/csrf-token"), {
        method: "GET",
        credentials: "include",
      });

      if (csrfResponse.ok) {
        const csrfData = await csrfResponse.json();
        const token = csrfData.csrfToken || "";
        setCsrfToken(token);
        return token;
      }

      setCsrfToken("");
      return "";
    } catch (error) {
      setCsrfToken("");
      return "";
    }
  };

  useEffect(() => {
    const myListener = async () => {
      try {
        const response = await fetch(apiUrl("/getSession"), {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          if (userData && userData._id) {
            setCurrentUser(userData);
          } else {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }

        await refreshCsrfToken();
      } catch (error) {
        console.error("Error fetching current user:", error);
        setCurrentUser(null);
        setCsrfToken("");
      } finally {
        setLoadingUser(false);
      }
    };

    myListener();
  }, []);

  if (loadingUser) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        csrfToken,
        refreshCsrfToken,
        loadingUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
