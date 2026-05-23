import { createContext, useEffect, useReducer } from "react";
import { getMe, loginUser, logoutUser } from "../services/api.js";
import { authReducer, initialState } from "./authReducer.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, setEstate] = useReducer(authReducer, initialState);

  const refreshSession = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const data = await getMe();
      dispatch({ type: "SET_USER", payload: data.user });
    } catch {
      dispatch({ type: "LOGOUT" });
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials);
      dispatch({ type: "SET_USER", payload: data.user });
      dispatch({ type: "SET_ERROR", payload: "" });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
       dispatch({ type: "LOGOUT" });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        error: state.error,
        isLoading: state.isLoading,
        isAuthenticated: !!state.user,
        isAdmin: state.user?.role === "admin",
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
