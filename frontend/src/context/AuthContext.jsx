import { useState, useEffect, createContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const myListener = async () => {
      try {
        const response = await fetch("http://localhost:3000/getSession", {
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
      } catch (error) {
        console.error("Error fetching current user:", error);
        setCurrentUser(null);
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
    <AuthContext.Provider value={{ currentUser, setCurrentUser, loadingUser }}>
      {children}
    </AuthContext.Provider>
  );
};
