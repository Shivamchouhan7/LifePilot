import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Search, Command } from 'lucide-react';
import { Button } from '../ui/button';
import { ThemeToggle } from '../common/ThemeToggle';
import { NotificationsPopover } from './NotificationsPopover';
import { QuickAddMenu } from './QuickAddMenu';
import { UserMenu } from './UserMenu';
import { GlobalSearchDialog } from './GlobalSearchDialog';

const ROUTE_TITLES = {
  '/': 'Overview',
  '/tasks': 'My Tasks',
  '/applications': 'Job Applications',
  '/calendar': 'Calendar',
  '/learning': 'Learning & Skills',
  '/projects': 'Projects',
  '/notes': 'Notes & Resources',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
};

export function TopBar({ onOpenMobileMenu }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  const currentTitle = ROUTE_TITLES[location.pathname] || 'LifePilot';

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 sm:px-6 backdrop-blur-md">
        {/* Left: Mobile trigger & Page title */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenMobileMenu}
            className="h-9 w-9 text-muted-foreground hover:text-foreground md:hidden"
            aria-label="Open mobile navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-semibold text-foreground">
              {currentTitle}
            </span>
          </div>
        </div>

        {/* Center: Global Search Trigger */}
        <div className="flex-1 max-w-md mx-4 hidden sm:block">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex w-full items-center justify-between rounded-lg border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground hover:border-muted-foreground/40 hover:bg-muted/40 transition-colors shadow-sm"
            aria-label="Search LifePilot workspace"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5" />
              <span>Search workspace...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground border border-border">
              <Command className="h-2.5 w-2.5" /> K
            </kbd>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {/* Mobile search icon button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            className="h-9 w-9 sm:hidden text-muted-foreground"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>

          <QuickAddMenu />
          <NotificationsPopover />
          <ThemeToggle />
          <div className="ml-1 pl-1 border-l border-border">
            <UserMenu />
          </div>
        </div>
      </header>

      <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
