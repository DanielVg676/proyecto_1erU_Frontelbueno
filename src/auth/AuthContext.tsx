import React, { createContext, useContext, useEffect, useState } from "react";

// Tipado del contexto
interface AuthContextType {
  token: string | null;
  user: any | null; // Puedes tipar mejor si sabes cómo es tu objeto usuario
  login: (token: string, user: any) => void;
  logout: () => void;
}

// Crear contexto
const AuthContext = createContext<AuthContextType | null>(null);

// Proveedor del contexto
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) setToken(storedToken);

    try {
      if (storedUser && storedUser !== "undefined") {
        const parsedUser = JSON.parse(storedUser);
        console.log("Parsed user from localStorage:", parsedUser); // Depuración
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error al parsear el usuario:", error);
      localStorage.removeItem("user");
    }
  }, []);

  const login = (tokenLogin: string, userLogin: any) => {
    console.log("Guardando usuario en login:", userLogin); // Depuración
    localStorage.setItem("token", tokenLogin);
    localStorage.setItem("user", JSON.stringify(userLogin));
    setToken(tokenLogin);
    setUser(userLogin);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}