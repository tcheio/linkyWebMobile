import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');

  const login = (id, username) => {
    setIsLoggedIn(true);
    setUserId(id);
    setUsername(username);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setUsername('');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
