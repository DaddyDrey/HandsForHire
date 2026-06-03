import { createContext, useContext } from 'react';
import type { InboxMode } from '../../services/messagesStore';

export type MessagesDrawerModeRequest = {
  mode: InboxMode;
  id: number;
};

export type MessagesDrawerContextType = {
  isOpen: boolean;
  activeProId: string | null;
  modeRequest: MessagesDrawerModeRequest | null;
  openDrawer: (proId?: string, mode?: InboxMode) => void;
  closeDrawer: () => void;
  setActiveProId: (proId: string | null) => void;
};

export const MessagesDrawerContext = createContext<MessagesDrawerContextType | null>(null);

export function useMessagesDrawer(): MessagesDrawerContextType {
  const ctx = useContext(MessagesDrawerContext);
  if (!ctx) throw new Error('useMessagesDrawer must be used within MessagesDrawerProvider');
  return ctx;
}
