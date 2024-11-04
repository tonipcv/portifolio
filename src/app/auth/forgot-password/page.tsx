'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError(null);
      setLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Recuperar senha</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Digite seu email para receber um link de recuperação
          </p>
        </div>

        {success ? (
          <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/50">
            <p className="text-sm text-green-700 dark:text-green-200">
              Se houver uma conta associada a este email, você receberá um link para redefinir sua senha.
            </p>
            <div className="mt-4">
              <Link
                href="/auth/login"
                className="text-sm text-blue-600 hover:underline"
              >
                Voltar para o login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar link de recuperação'}
            </button>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-sm text-blue-600 hover:underline"
              >
                Voltar para o login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 