'use client'

import { useActionState } from 'react'
import { adminLogin } from './actions'

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(adminLogin, null)

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--color-bg)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-line)',
        }}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <h1
            className="font-display font-bold mb-2"
            style={{ fontSize: '1.5rem', color: 'var(--color-ink)' }}
          >
            لوحة تحكم المستشار
          </h1>
          <p
            className="font-body"
            style={{ fontSize: '0.9rem', color: 'var(--color-ink-faint)' }}
          >
            أدخل كلمة المرور للوصول
          </p>
        </div>

        {/* Form */}
        <form action={formAction} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="font-body font-medium"
              style={{ fontSize: '0.82rem', color: 'var(--color-ink-dim)', letterSpacing: '0.05em' }}
            >
              كلمة المرور
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={isPending}
              className="input-field w-full rounded-lg px-4 py-3 font-body disabled:opacity-50"
              style={{
                background: 'var(--color-bg)',
                border: '1px solid var(--color-line)',
                color: 'var(--color-ink)',
                fontSize: '1rem',
                outline: 'none',
              }}
              placeholder="••••••••••••"
            />
          </div>

          {/* Error message */}
          {state?.error && (
            <p
              className="font-body text-center"
              style={{ fontSize: '0.85rem', color: 'oklch(65% 0.18 25)' }}
              role="alert"
            >
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="
              min-h-[50px] w-full rounded-lg
              font-body font-semibold
              flex items-center justify-center gap-2
              transition-all duration-[180ms]
              disabled:opacity-50 disabled:cursor-not-allowed
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
            "
            style={{
              background: isPending ? 'var(--color-accent-muted)' : 'var(--color-accent)',
              color: 'var(--color-bg)',
              fontSize: '0.97rem',
            }}
          >
            {isPending && (
              <span
                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
                aria-hidden="true"
              />
            )}
            {isPending ? 'جارٍ التحقق...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  )
}
