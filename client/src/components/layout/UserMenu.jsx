import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAuth } from '../../context/AuthContext';
import { Settings, LogOut } from 'lucide-react';

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
    : 'LP';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs border border-primary/20 hover:ring-2 hover:ring-primary/20 transition-all outline-none"
          aria-label="Open user menu"
        >
          {initials}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-1.5 border-border bg-card">
        <div className="flex items-center gap-2.5 p-2 border-b border-border mb-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs shrink-0">
            {initials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-foreground truncate">
              {user?.name || 'LifePilot User'}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {user?.email || 'user@lifepilot.app'}
            </span>
          </div>
        </div>

        <DropdownMenuItem
          onClick={() => navigate('/settings')}
          className="gap-2 cursor-pointer text-xs py-2"
        >
          <Settings className="h-4 w-4 text-muted-foreground" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="gap-2 cursor-pointer text-xs py-2 text-danger focus:text-danger focus:bg-danger/10"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
