import React, { createContext, useState } from 'react';

export const CompteurContext = createContext();

export const CompteurProvider = ({ children }) => {
  const [selectedCompteur, setSelectedCompteur] = useState(null);

  return (
    <CompteurContext.Provider value={{ selectedCompteur, setSelectedCompteur }}>
      {children}
    </CompteurContext.Provider>
  );
};
