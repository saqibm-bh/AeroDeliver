"use client";

import React from 'react';
import { Bell, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type BasicUser = { email?: string | null } | null | undefined;
interface DashboardHeaderProps {
  user: BasicUser;
  userRole: 'customer' | 'store_owner' | 'rider' | 'admin';
}

export function DashboardHeader({ user, userRole }: DashboardHeaderProps) {
  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      customer: 'Customer',
      store_owner: 'Store Owner',
      rider: 'Rider',
      admin: 'Administrator'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Search */}
        <div className="flex items-center space-x-4 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>

          {/* User Info */}
          <div className="flex items-center space-x-3 border-l border-border pl-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">
                {user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-muted-foreground">
                {getRoleDisplayName(userRole)}
              </p>
            </div>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
