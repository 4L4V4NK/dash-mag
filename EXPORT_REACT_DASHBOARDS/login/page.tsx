'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './login.module.css';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Background decorativo */}
      <div className={styles.background}>
        <div className={styles.gradientOrb1}></div>
        <div className={styles.gradientOrb2}></div>
        <div className={styles.gridPattern}></div>
      </div>

      {/* Card de login */}
      <div className={styles.loginCard}>
        {/* Logo e header */}
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" fill="url(#logoGradient)" />
              <path
                d="M24 8L32 16L24 24L16 16L24 8Z"
                fill="white"
                opacity="0.9"
              />
              <path
                d="M24 24L32 32L24 40L16 32L24 24Z"
                fill="white"
                opacity="0.6"
              />
              <defs>
                <linearGradient
                  id="logoGradient"
                  x1="4"
                  y1="4"
                  x2="44"
                  y2="44"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#0A4D8C" />
                  <stop offset="100%" stopColor="#1E5FA8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className={styles.title}>Sentinela</h1>
          <p className={styles.subtitle}>Sistema de Operação Inteligente</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <div className={styles.inputWrapper}>
              <svg
                className={styles.inputIcon}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Senha
            </label>
            <div className={styles.inputWrapper}>
              <svg
                className={styles.inputIcon}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="password"
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className={styles.spinner}></div>
                Entrando...
              </>
            ) : (
              <>
                <span>Entrar</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Footer com credenciais de demo */}
        <div className={styles.demoCredentials}>
          <div className={styles.divider}>
            <span>Credenciais de demonstração</span>
          </div>
          <div className={styles.credentialsList}>
            <div className={styles.credentialItem}>
              <span className={styles.credentialRole}>Admin</span>
              <code className={styles.credentialCode}>admin@nereidas.com / admin123</code>
            </div>
            <div className={styles.credentialItem}>
              <span className={styles.credentialRole}>Operador</span>
              <code className={styles.credentialCode}>operador@nereidas.com / operador123</code>
            </div>
            <div className={styles.credentialItem}>
              <span className={styles.credentialRole}>Viewer</span>
              <code className={styles.credentialCode}>viewer@nereidas.com / viewer123</code>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <p>© 2025 Nereidas. Todos os direitos reservados.</p>
      </div>
    </div>
  );
}
