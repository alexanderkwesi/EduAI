import { createContext, useContext, useState, useEffect, useCallback } from "react";

const API = "http://localhost:5000/api";
const BASE_API = import.meta.env.VITE_API_URL||"http://localhost:8000/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("eduai_token"));
  const [loading, setLoading] = useState(true);

  const apiFetch = useCallback(async (path, opts = {}) => {
    const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API}${path}`, { ...opts, headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(err.detail || "Request failed");
    }
    return res.json();
  }, [token]);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    apiFetch("/auth/me")
      .then(setUser)
      .catch(() => { localStorage.removeItem("eduai_token"); setToken(null); })
      .finally(() => setLoading(false));
  }, [token, apiFetch]);

  const login = async (email, password) => {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("eduai_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (first_name, last_name, email, password) => {
    const data = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ first_name, last_name, email, password }),
    });
    localStorage.setItem("eduai_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const demoLogin = async () => {
    const data = await apiFetch("/auth/demo-login", { method: "POST" });
    localStorage.setItem("eduai_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("eduai_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, loading, login, register, demoLogin, logout, apiFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
