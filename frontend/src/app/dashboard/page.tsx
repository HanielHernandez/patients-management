'use client';

import { useAuth } from '@/components/providers/auth-provider';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <>
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
    </>
  );
}
