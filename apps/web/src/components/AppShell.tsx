'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, Github, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navLinks = [
    { href: '/', label: 'Simulator' },
    { href: '/history', label: 'History' },
    { href: '/about', label: 'About' },
  ]

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'rgb(var(--bg))' }}>
      {/* Navigation */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{
          borderBottom: '1px solid rgb(var(--border))',
          backgroundColor: 'rgb(var(--card) / 0.85)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div
                className="p-2 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/20"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span
                className="font-black text-xl tracking-tighter hidden sm:inline text-zinc-900 dark:text-zinc-100"
              >
                VENTURE<span className="text-indigo-600">FORGE</span>
              </span>
            </Link>

            {/* Center Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    style={{
                      color: isActive
                        ? 'rgb(var(--accent))'
                        : 'rgb(var(--text-secondary))',
                      backgroundColor: isActive
                        ? 'rgb(var(--accent-soft))'
                        : 'transparent',
                    }}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2.5 rounded-lg transition-colors"
                  style={{ color: 'rgb(var(--text-secondary))' }}
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-[18px] h-[18px]" />
                  ) : (
                    <Moon className="w-[18px] h-[18px]" />
                  )}
                </button>
              )}
              <a
                href="https://github.com/chetas1208/Startup_sim"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg transition-colors"
                style={{ color: 'rgb(var(--text-secondary))' }}
                aria-label="GitHub"
              >
                <Github className="w-[18px] h-[18px]" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer
        className="mt-auto"
        style={{
          borderTop: '1px solid rgb(var(--border))',
          backgroundColor: 'rgb(var(--muted))',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-500 font-medium">
              © {new Date().getFullYear()} VentureForge. Powered by Autonomous Agents.
            </p>
            <div className="flex items-center gap-6">
              {['Privacy', 'Terms', 'Contact'].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="text-sm transition-colors hover:underline"
                  style={{ color: 'rgb(var(--text-secondary))' }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
