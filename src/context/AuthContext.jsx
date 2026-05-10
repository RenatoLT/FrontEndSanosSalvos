import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const getStoredUser = () => {
		try {
			const stored = localStorage.getItem("user");

			if (!stored || stored === "undefined") return null;

			return JSON.parse(stored);
		} catch (err) {
			console.error("Error parseando user:", err);
			localStorage.removeItem("user");
			return null;
		}
	};

	const [user, setUser] = useState(getStoredUser());

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) setUser(stored);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}