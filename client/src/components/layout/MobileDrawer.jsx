import React, { useEffect } from 'react';
import { Logo } from './Logo';
import { SidebarNavItem } from './SidebarNavItem';
import { NAVIGATION } from '../../constants/navigation';
import { useAuth } from '../../context/AuthContext';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

export function MobileDrawer({ open, onClose }) {
  const { user } = useAuth();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer content */}
      <div className="relative flex w-full max-w-xs flex-1 flex-col bg-sidebar border-r border-sidebar-border text-sidebar-foreground shadow-2xl animate-in slide-in-from-left duration-200">
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          <Logo collapsed={false} />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAVIGATION.map((group) => (
            <div key={group.group} className="space-y-1">
              <h4 className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {group.group}
              </h4>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <SidebarNavItem
                    key={item.path}
                    item={item}
                    collapsed={false}
                    onNavigate={onClose}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* User profile footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs border border-primary/20">
              {user?.name
                ? user.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                : 'LP'}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium text-foreground truncate">
                {user?.name || 'LifePilot User'}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user?.email || 'user@lifepilot.app'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
