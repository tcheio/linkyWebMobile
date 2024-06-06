import React, { createContext, useState } from 'react';
import { CompteurContext } from './CompteurContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  //const { setSelectedCompteur } = useContext(CompteurContext);

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
