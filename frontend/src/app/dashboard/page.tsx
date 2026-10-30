'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <header className="flex items-center justify-between border-b bg-background px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold">Patient Management</h1>
          <p className="text-sm text-muted-foreground">
            Healthcare administration dashboard
          </p>
        </div>

        <Button variant="outline" onClick={logout}>
          Sign out
        </Button>
      </header>

      <section className="mx-auto max-w-7xl space-y-6 p-6">
        <div>
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Welcome, {user.email}
          </p>
        </div>

        <div className="rounded-lg border bg-background p-6">
          <p className="text-sm text-muted-foreground">Your role</p>
          <p className="mt-1 text-lg font-medium">{user.role}</p>
        </div>
      </section>
    </main>
  );
}