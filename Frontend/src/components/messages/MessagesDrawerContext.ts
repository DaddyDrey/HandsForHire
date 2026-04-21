import { createContext, useContext } from 'react';

export type MessagesDrawerContextType = {
  isOpen: boolean;
  activeProId: string | null;
  openDrawer: (proId?: string) => void;
  closeDrawer: () => void;
  setActiveProId: (proId: string | null) => void;
};

export const MessagesDrawerContext = createContext<MessagesDrawerContextType | null>(null);

export function useMessagesDrawer(): MessagesDrawerContextType {
  const ctx = useContext(MessagesDrawerContext);
  if (!ctx) throw new Error('useMessagesDrawer must be used within MessagesDrawerProvider');
  return ctx;
}
