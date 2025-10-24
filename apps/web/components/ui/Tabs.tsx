/**
 * @fileoverview Tab components for organizing content into tabbed interfaces
 */

'use client';

import { useState, ReactNode, createContext, useContext } from 'react';
import { clsx } from 'clsx';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

const TABS_CONTAINER_CLASSES = 'w-full';
const TABS_LIST_CLASSES = 'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground';
const TABS_TRIGGER_BASE_CLASSES = 'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
const TABS_TRIGGER_ACTIVE_CLASSES = 'bg-background text-foreground shadow-sm';
const TABS_CONTENT_CLASSES = 'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

/**
 * @description Renders a tab container with context for managing active tab state
 * @param defaultValue - Default active tab value
 * @param value - Controlled active tab value
 * @param onValueChange - Callback when active tab changes
 * @param children - Tab components
 * @param className - Additional CSS classes
 */
export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultValue || ''
  );

  const activeTab = value !== undefined ? value : internalActiveTab;
  
  /**
   * @description Sets the active tab, either controlled or internal
   * @param newValue - New active tab value
   */
  const setActiveTab = (newValue: string): void => {
    if (onValueChange) {
      onValueChange(newValue);
    } else {
      setInternalActiveTab(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={clsx(TABS_CONTAINER_CLASSES, className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

/**
 * @description Renders a tab list container
 * @param children - Tab trigger components
 * @param className - Additional CSS classes
 */
export function TabsList({ children, className }: TabsListProps) {
  return (
    <div className={clsx(TABS_LIST_CLASSES, className)}>
      {children}
    </div>
  );
}

/**
 * @description Renders a tab trigger button
 * @param value - Tab value identifier
 * @param children - Tab trigger content
 * @param className - Additional CSS classes
 */
export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  /**
   * @description Handles tab trigger click
   */
  const handleClick = (): void => {
    setActiveTab(value);
  };

  const triggerClasses = clsx(
    TABS_TRIGGER_BASE_CLASSES,
    isActive && TABS_TRIGGER_ACTIVE_CLASSES,
    className
  );

  return (
    <button onClick={handleClick} className={triggerClasses}>
      {children}
    </button>
  );
}

/**
 * @description Renders tab content that shows only when tab is active
 * @param value - Tab value identifier
 * @param children - Tab content
 * @param className - Additional CSS classes
 */
export function TabsContent({ value, children, className }: TabsContentProps) {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }

  const { activeTab } = context;
  const isActive = activeTab === value;

  if (!isActive) {
    return null;
  }

  return (
    <div className={clsx(TABS_CONTENT_CLASSES, className)}>
      {children}
    </div>
  );
}
