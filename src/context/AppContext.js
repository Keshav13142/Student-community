const { createContext, useState } = require("react");

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const [selectedCommunity, setSelectedCommunity] = useState(null);

  return (
    <AppContext.Provider
      value={
        (currentUser, setCurrentUser, selectedCommunity, setSelectedCommunity)
      }>
      {children}
    </AppContext.Provider>
  );
};
