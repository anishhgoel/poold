'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser({ email: data.user.email || 'Unknown email' });
      }
    };

    fetchUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-zinc-900">
              poold
            </Link>
            <nav className="ml-8 hidden md:flex space-x-4">
              <Link href="/dashboard" className="text-sm font-medium text-zinc-700 hover:text-zinc-900">
                Dashboard
              </Link>
              <Link href="/dashboard/groups" className="text-sm font-medium text-zinc-700 hover:text-zinc-900">
                Groups
              </Link>
              <Link href="/dashboard/subscriptions" className="text-sm font-medium text-zinc-700 hover:text-zinc-900">
                Subscriptions
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {user && <span className="text-sm text-zinc-500">{user.email}</span>}
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
} 