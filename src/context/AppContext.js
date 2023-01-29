import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const [isInstitutionAdmin, setIsInstitutionAdmin] = useState(false);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isInstitutionAdmin,
        setIsInstitutionAdmin,
      }}>
      {children}
    </AppContext.Provider>
  );
};
