import React, { createContext, useState } from 'react';

export const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [tokenBalanceChanged, setTokenBalanceChanged] = useState(false);

  return (
    <AppContext.Provider value={{ tokenBalanceChanged, setTokenBalanceChanged }}>
      {children}
    </AppContext.Provider>
  );
};
