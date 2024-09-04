import React, { createContext, useState } from "react";

type IAuthContext = {
  session: string;
  ganhos: number;
  setValorGanhos: (arg: number) => void;
  setAuth: (arg: string) => void;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<IAuthContext>({
  session: "",
  ganhos: 0,
  setValorGanhos: () => 0,
  setAuth: () => "",
});

export const getSession = () => {
  return JSON.parse(localStorage.getItem("session")!);
};

export const setSessionInLocalStorage = (token: string) => {
  localStorage.setItem("session", JSON.stringify(token));
  return true;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = getSession();
  const [ganhos, setGanhos] = useState(0);

  const [session, setSession] = useState(auth || "");
  const setAuth = (token: string): void => {
    setSession(token);
    setSessionInLocalStorage(token);
  }

  const setValorGanhos = (valor: number) => {
    setGanhos(valor);
  };

  return (
    <AuthContext.Provider value={{ session, setAuth, ganhos, setValorGanhos }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
