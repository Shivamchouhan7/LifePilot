import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileDrawer } from './MobileDrawer';

const COLLAPSED_STORAGE_KEY = 'lifepilot:sidebar-collapsed';

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSED_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSED_STORAGE_KEY, collapsed.toString());
    } catch (e) {
      console.error('Failed to save sidebar collapsed state:', e);
    }
  }, [collapsed]);

  const toggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* Desktop Fixed Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
      />

      {/* Mobile Drawer */}
      <MobileDrawer
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar onOpenMobileMenu={() => setMobileDrawerOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in-50 duration-150">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
