import React, { createContext, useState } from 'react';

const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("English");

  const handleLanguageChange = () => {
    const newLanguage = language === "English" ? "Arabic" : "English";
    setLanguage(newLanguage);
    // Implement your language change logic here
  };

  return (
    <LanguageContext.Provider value={{ language, handleLanguageChange }}>
      {children}
    </LanguageContext.Provider>
  );
};

export { LanguageContext, LanguageProvider };
