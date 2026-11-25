import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Briefcase,
  Calendar,
  GraduationCap,
  FolderGit2,
  FileText,
  BarChart3,
  Settings,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const ICON_MAP = {
  LayoutDashboard,
  CheckSquare,
  Briefcase,
  Calendar,
  GraduationCap,
  FolderGit2,
  FileText,
  BarChart3,
  Settings,
};

export function SidebarNavItem({ item, collapsed = false, onNavigate }) {
  const Icon = ICON_MAP[item.icon] || LayoutDashboard;

  const content = (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-primary/10 text-primary font-semibold'
            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
        } ${collapsed ? 'justify-center px-2' : ''}`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-primary" />
          )}
          <Icon className={`h-4 w-4 shrink-0 transition-transform ${isActive ? 'text-primary' : ''}`} />
          {!collapsed && <span className="truncate">{item.name}</span>}
        </>
      )}
    </NavLink>
  );

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            {item.name}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}
