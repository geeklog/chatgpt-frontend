import React, { createContext, useReducer, useContext } from 'react';
import { ModelType, ModelTypeEnum } from '../types';

type Settings = {
  llm: ModelType;
};

type SettingAction =
  | { type: 'SET_LLM'; payload: ModelType }

function reducer(state: Settings, action: SettingAction): Settings {
  switch (action.type) {
    case 'SET_LLM':
      return { ...state, llm: action.payload };
    default:
      throw new Error();
  }
}

type SettingContextProps = Settings & {
  setLLM: (llm: ModelType) => void 
};

const SettingContext = createContext<SettingContextProps | undefined>(undefined);

export const SettingProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { llm: ModelTypeEnum.ChatGPT });
  const setters = {
    setLLM(llm: ModelType) {
      dispatch({type: 'SET_LLM', payload: llm})
    }
  }
  const settings = {...state, ...setters}
  return (
    <SettingContext.Provider value={settings}>
      {children}
    </SettingContext.Provider>
  );
};

export function useSettings() {
  const context = useContext(SettingContext);
  if (context === undefined) {
    throw new Error('useStateValue must be used within a StateProvider');
  }
  return context;
}