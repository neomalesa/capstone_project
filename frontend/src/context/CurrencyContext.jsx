import React, { createContext, useState, useContext } from 'react';

const CurrencyContext = createContext(null);

export const CURRENCY_SYMBOLS = {
  zar: 'R',
  usd: '$',
  eur: '€'
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('zar');
  const currencySymbol = CURRENCY_SYMBOLS[currency] || 'R';

  return (
    <CurrencyContext.Provider value={{ currency, currencySymbol, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
