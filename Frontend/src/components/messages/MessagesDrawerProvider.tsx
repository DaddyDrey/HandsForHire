import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { MessagesDrawerContext, type MessagesDrawerContextType } from './MessagesDrawerContext';
import MessagesDrawer from './MessagesDrawer';

export function MessagesDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeProId, setActiveProId] = useState<string | null>(null);

  const openDrawer = useCallback((proId?: string) => {
    if (proId !== undefined) setActiveProId(proId);
    setIsOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo<MessagesDrawerContextType>(
    () => ({ isOpen, activeProId, openDrawer, closeDrawer, setActiveProId }),
    [isOpen, activeProId, openDrawer, closeDrawer]
  );

  return (
    <MessagesDrawerContext.Provider value={value}>
      {children}
      <MessagesDrawer />
    </MessagesDrawerContext.Provider>
  );
}
