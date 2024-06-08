import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [isPrincipal, setIsPrincipal] = useState(false);

  const login = (id, username, isComptePrincipal) => {
    setIsLoggedIn(true);
    setUserId(id);
    setUsername(username);
    setIsPrincipal(isComptePrincipal);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setUsername('');
    setIsPrincipal(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, username, isPrincipal, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
