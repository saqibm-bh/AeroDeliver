"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  MapPin, 
  CreditCard, 
  User, 
  Settings, 
  HelpCircle,
  Store,
  BarChart3,
  Users,
  Truck,
  Bike,
  Plane,
  Bell,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationConfig = {
  customer: [
    { label: "Dashboard", href: "/customer/dashboard", icon: Home },
    { label: "Browse Stores", href: "/stores", icon: Store },
    { label: "My Orders", href: "/customer/orders", icon: Package },
    { label: "Track Delivery", href: "/customer/track", icon: MapPin },
    { label: "Cart", href: "/customer/cart", icon: ShoppingCart },
    { label: "Addresses", href: "/customer/addresses", icon: MapPin },
    { label: "Payment Methods", href: "/customer/payment", icon: CreditCard },
    { label: "Profile", href: "/customer/profile", icon: User },
    { label: "Support", href: "/support", icon: HelpCircle }
  ],
  store_owner: [
    { label: "Dashboard", href: "/stores/dashboard", icon: Home },
    { label: "Store Management", href: "/stores/manage", icon: Store },
    { label: "Products", href: "/stores/products", icon: Package },
    { label: "Orders", href: "/stores/orders", icon: FileText },
    { label: "Analytics", href: "/stores/analytics", icon: BarChart3 },
    { label: "Inventory", href: "/stores/inventory", icon: Package },
    { label: "Profile", href: "/stores/profile", icon: User },
    { label: "Settings", href: "/stores/settings", icon: Settings }
  ],
  rider: [
    { label: "Dashboard", href: "/riders/dashboard", icon: Home },
    { label: "Available Orders", href: "/riders/orders", icon: Package },
    { label: "My Deliveries", href: "/riders/deliveries", icon: Truck },
    { label: "Route Optimizer", href: "/riders/routes", icon: MapPin },
    { label: "Earnings", href: "/riders/earnings", icon: CreditCard },
    { label: "Performance", href: "/riders/performance", icon: BarChart3 },
    { label: "Profile", href: "/riders/profile", icon: User },
    { label: "Support", href: "/support", icon: HelpCircle }
  ],
  admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: Home },
    { label: "User Management", href: "/admin/users", icon: Users },
    { label: "Store Management", href: "/admin/stores", icon: Store },
    { label: "Fleet Management", href: "/admin/fleet", icon: Truck },
    { label: "Drone Fleet", href: "/admin/drones", icon: Plane },
    { label: "Rider Fleet", href: "/admin/riders", icon: Bike },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Orders", href: "/admin/orders", icon: Package },
    { label: "Notifications", href: "/admin/notifications", icon: Bell },
    { label: "System Settings", href: "/admin/settings", icon: Settings }
  ]
};

interface DashboardSidebarProps {
  userRole: 'customer' | 'store_owner' | 'rider' | 'admin';
}

export function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const pathname = usePathname();
  const navigation = navigationConfig[userRole] || [];

  return (
    <div className="fixed top-0 left-0 h-screen w-80 bg-sidebar-background border-r border-sidebar-border flex flex-col">
      {/* Brand */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Plane className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">AeroDeliver</span>
        </Link>
        <p className="text-sm text-sidebar-foreground/60 mt-1 capitalize">
          {userRole.replace('_', ' ')} Portal
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Actions */}
      <div className="p-4 border-t border-sidebar-border">
        <Link
          href="/logout"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors"
        >
          <User className="w-5 h-5" />
          <span>Sign Out</span>
        </Link>
      </div>
    </div>
  );
}
