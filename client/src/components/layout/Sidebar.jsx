import React from 'react';
import { Logo } from './Logo';
import { SidebarNavItem } from './SidebarNavItem';
import { NAVIGATION } from '../../constants/navigation';
import { useAuth } from '../../context/AuthContext';
import { PanelLeftClose, PanelLeft } from 'lucide-react';
import { Button } from '../ui/button';

export function Sidebar({ collapsed, onToggleCollapse, className = '' }) {
  const { user } = useAuth();

  return (
    <aside
      className={`relative hidden md:flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200 ease-in-out shrink-0 select-none z-30 ${
        collapsed ? 'w-16' : 'w-64'
      } ${className}`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        <Logo collapsed={collapsed} />
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8 text-muted-foreground hover:text-foreground hidden lg:flex"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAVIGATION.map((group) => (
          <div key={group.group} className="space-y-1">
            {!collapsed && (
              <h4 className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {group.group}
              </h4>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <SidebarNavItem
                  key={item.path}
                  item={item}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile Block */}
      <div className="border-t border-sidebar-border p-3">
        <div
          className={`flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50 ${
            collapsed ? 'justify-center p-1' : ''
          }`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs border border-primary/20">
            {user?.name
              ? user.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
              : 'LP'}
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium text-foreground truncate">
                {user?.name || 'LifePilot User'}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user?.role || 'Personal Workspace'}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
