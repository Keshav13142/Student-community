import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
      }}>
      {children}
    </AppContext.Provider>
  );
};
