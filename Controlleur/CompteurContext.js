import React, { createContext, useState } from 'react';

export const CompteurContext = createContext();

export const CompteurProvider = ({ children }) => {
  const [selectedCompteur, setSelectedCompteur] = useState(null);
  const [numCompteur, setNumCompteur] = useState(null);

  return (
    <CompteurContext.Provider value={{ selectedCompteur, setSelectedCompteur, numCompteur, setNumCompteur }}>
      {children}
    </CompteurContext.Provider>
  );
};
