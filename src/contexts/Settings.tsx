import { useDisclosure, UseDisclosureReturn } from '@chakra-ui/react';
import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext<{modal?: UseDisclosureReturn}>({});

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useStateContext must be used within a StateProvider');
  }
  return context;
}

export function SettingsProvider({ children }: any) {
  const settingModel = useDisclosure();
  return (
    <SettingsContext.Provider value={{modal: settingModel}}>
      {children}
    </SettingsContext.Provider>
  );
}