import React, { useState, createContext } from 'react';

export const CurrencyContext = createContext([{}, () => {}]);

export const CurrencyProvider: React.FC = props => {
  const [state, setState] = useState({});
  return <CurrencyContext.Provider value={[state, setState]}>{props.children}</CurrencyContext.Provider>;
};
