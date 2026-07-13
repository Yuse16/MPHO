'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(
        authError.message.includes('already registered')
          ? 'Este correo ya está registrado.'
          : 'Error al crear la cuenta. Intenta de nuevo.',
      );
      setLoading(false);
      return;
    }

    setSuccess('Cuenta creada. Revisa tu correo para confirmar tu cuenta.');
    setTimeout(() => router.push('/login'), 2000);
  }

  return (
    <div className="glass p-8 rounded-[var(--radius-xl)]">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-[color:var(--color-foreground)]">
          Crear cuenta
        </h1>
        <p className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">
          Únete a MPHO y encuentra el regalo perfecto
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-[color:var(--color-destructive)]/10 border border-[color:var(--color-destructive)]/30 p-3 text-sm text-[color:var(--color-destructive)]">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-[color:var(--color-lime)]/10 border border-[color:var(--color-lime)]/30 p-3 text-sm text-[color:var(--color-lime)]">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-[color:var(--color-muted-foreground)]"
          >
            Correo electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-faint)]" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full rounded-[var(--radius-md)] border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface)] py-2.5 pl-10 pr-4 text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-faint)] focus:border-[color:var(--color-border-lime)] focus:outline-none focus:ring-1 focus:ring-[color:var(--color-border-lime)] transition-colors"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-[color:var(--color-muted-foreground)]"
          >
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-faint)]" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full rounded-[var(--radius-md)] border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface)] py-2.5 pl-10 pr-10 text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-faint)] focus:border-[color:var(--color-border-lime)] focus:outline-none focus:ring-1 focus:ring-[color:var(--color-border-lime)] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--color-faint)] hover:text-[color:var(--color-muted-foreground)] transition-colors"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium text-[color:var(--color-muted-foreground)]"
          >
            Confirmar contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-faint)]" />
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu contraseña"
              className="w-full rounded-[var(--radius-md)] border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface)] py-2.5 pl-10 pr-10 text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-faint)] focus:border-[color:var(--color-border-lime)] focus:outline-none focus:ring-1 focus:ring-[color:var(--color-border-lime)] transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-[var(--radius-md)] bg-[color:var(--color-lime)] px-4 py-2.5 text-sm font-semibold text-[color:var(--color-primary-foreground)] transition-all hover:bg-[color:var(--color-lime-intense)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[color:var(--color-muted-foreground)]">
        ¿Ya tienes cuenta?{' '}
        <Link
          href="/login"
          className="font-medium text-[color:var(--color-lime)] hover:underline"
        >
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
