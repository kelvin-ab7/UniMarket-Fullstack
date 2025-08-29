import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  return useContext(AuthContext);
};

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const storedAuth = localStorage.getItem("auth");
    if (!storedAuth) return null;
    
    try {
      // Try to parse as JSON first (for user objects)
      return JSON.parse(storedAuth);
    } catch (error) {
      // If it's not valid JSON, it might be a token string
      // In this case, we don't have user data, so return null
      console.log("Invalid JSON in localStorage, clearing auth");
      localStorage.removeItem("auth");
      return null;
    }
  });

  useEffect(() => {
    if (auth) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth");
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// import { createContext, useContext, useState } from "react";

// export const AuthContext = createContext();

// // eslint-disable-next-line react-refresh/only-export-components
// export const useAuthContext = () => {
//   return useContext(AuthContext);
// };

// // eslint-disable-next-line react/prop-types
// export const AuthContextProvider = ({ children }) => {
//   const [auth, setAuth] = useState(
//     JSON.parse(localStorage.getItem("chat-user")) || null
//   );

//   return (
//     <AuthContext.Provider value={{ auth, setAuth }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
