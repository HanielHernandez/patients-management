'use client';

import { useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from 'cn';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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
      <header className="flex flex-wrap items-center justify-between gap-3 border-b bg-background px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold">Patient Management</h1>
          <p className="text-sm text-muted-foreground">
            Healthcare administration dashboard
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({
                variant: pathname === '/dashboard' ? 'secondary' : 'ghost',
              }),
            )}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/patients"
            className={cn(
              buttonVariants({
                variant: pathname.startsWith('/dashboard/patients')
                  ? 'secondary'
                  : 'ghost',
              }),
            )}
          >
            Patients
          </Link>
          <Button variant="outline" onClick={logout}>
            Sign out
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl space-y-6 p-6">
        {children}
      </section>
    </main>
  );
}
