import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Bell, BellOff } from 'lucide-react';

export function NotificationsPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
          aria-label="View notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h4 className="text-sm font-semibold text-foreground">Notifications</h4>
          <span className="text-xs text-muted-foreground">0 unread</span>
        </div>
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
            <BellOff className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-foreground">No notifications yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            You will receive reminders for upcoming interviews and overdue tasks here.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
