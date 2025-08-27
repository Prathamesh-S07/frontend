import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Helper: check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (!decoded.exp) return false;
      return Date.now() >= decoded.exp * 1000;
    } catch {
      return true;
    }
  };

  // Load user from JWT on mount, auto-logout if expired
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      if (isTokenExpired(token)) {
        localStorage.removeItem("jwt");
        setUser(null);
      } else {
        try {
          const decoded = jwtDecode(token);
          setUser({ username: decoded.sub, role: decoded.role });
        } catch {
          localStorage.removeItem("jwt");
          setUser(null);
        }
      }
    }
  }, []);

  const setUserFromToken = useCallback((token) => {
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("jwt");
      setUser(null);
      return;
    }
    localStorage.setItem("jwt", token);
    try {
      const decoded = jwtDecode(token);
      setUser({ username: decoded.sub, role: decoded.role });
    } catch {
      setUser(null);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("jwt");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, setUserFromToken, logout }),
    [user, setUserFromToken, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
