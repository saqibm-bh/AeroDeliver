import React from 'react';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'customer' | 'store_owner' | 'rider' | 'admin';
}

export async function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }
  
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar userRole={userRole} />
      <div className="ml-80">
        <DashboardHeader user={user} userRole={userRole} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
