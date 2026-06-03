import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { MessagesDrawerContext, type MessagesDrawerContextType } from './MessagesDrawerContext';
import MessagesDrawer from './MessagesDrawer';
import type { InboxMode } from '../../services/messagesStore';

export function MessagesDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeProId, setActiveProId] = useState<string | null>(null);
  const [modeRequest, setModeRequest] = useState<MessagesDrawerContextType['modeRequest']>(null);

  const openDrawer = useCallback((proId?: string, mode?: InboxMode) => {
    if (proId !== undefined) setActiveProId(proId);
    if (mode || proId !== undefined) {
      setModeRequest((current) => ({
        mode: mode ?? 'client',
        id: (current?.id ?? 0) + 1,
      }));
    }
    setIsOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo<MessagesDrawerContextType>(
    () => ({ isOpen, activeProId, modeRequest, openDrawer, closeDrawer, setActiveProId }),
    [isOpen, activeProId, modeRequest, openDrawer, closeDrawer]
  );

  return (
    <MessagesDrawerContext.Provider value={value}>
      {children}
      <MessagesDrawer />
    </MessagesDrawerContext.Provider>
  );
}
