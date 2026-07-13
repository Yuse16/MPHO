'use client';

import { useAuth } from '@/lib/auth-context';
import { LogOut, Mail, CalendarDays } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--color-lime)] border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const createdAt = new Date(user.created_at).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mx-auto max-w-lg py-12 px-4">
      <div className="glass p-8 rounded-[var(--radius-xl)]">
        <h1 className="text-2xl font-bold text-[color:var(--color-foreground)] mb-6">
          Mi cuenta
        </h1>

        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-[var(--radius-md)] bg-[color:var(--color-surface)] p-4">
            <Mail className="h-5 w-5 text-[color:var(--color-faint)]" />
            <div>
              <p className="text-xs text-[color:var(--color-faint)]">Correo</p>
              <p className="text-sm text-[color:var(--color-foreground)]">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-[var(--radius-md)] bg-[color:var(--color-surface)] p-4">
            <CalendarDays className="h-5 w-5 text-[color:var(--color-faint)]" />
            <div>
              <p className="text-xs text-[color:var(--color-faint)]">Miembro desde</p>
              <p className="text-sm text-[color:var(--color-foreground)]">{createdAt}</p>
            </div>
          </div>
        </div>

        <button
          onClick={signOut}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[color:var(--color-border-soft)] bg-transparent px-4 py-2.5 text-sm font-medium text-[color:var(--color-muted-foreground)] transition-colors hover:border-[color:var(--color-destructive)] hover:text-[color:var(--color-destructive)]"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
