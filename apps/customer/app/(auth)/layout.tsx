import type { ReactNode } from 'react';
import { CustomerShell } from '@/components/customer-shell';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <CustomerShell>
      <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 pb-28 pt-8 lg:pb-10">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </CustomerShell>
  );
}
