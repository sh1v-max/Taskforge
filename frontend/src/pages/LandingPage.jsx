import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Hammer,
  CheckCircle,
  Zap,
  Shield,
  Moon,
  ListFilter,
  Smartphone,
  ArrowRight,
  BookOpen,
  Mail,
} from 'lucide-react'

// lucide-react dropped brand icons, so the GitHub mark is inlined
function GithubIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.12v3.14c0 .3.2.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}
import { ThemeToggle } from '../components/Common/ThemeToggle'

const API_DOCS_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/docs`

// Fake tasks for the hero preview card — purely visual
const previewTasks = [
  { title: 'Ship the landing page', status: 'completed', badge: 'Completed', badgeClass: 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300' },
  { title: 'Review pull requests', status: 'in-progress', badge: 'In Progress', badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' },
  { title: 'Plan next sprint', status: 'pending', badge: 'Pending', badgeClass: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-300' },
]

const features = [
  {
    icon: CheckCircle,
    title: 'Simple Tracking',
    text: 'Pending, in progress, completed — three statuses, zero confusion. Change status with a single click.',
  },
  {
    icon: ListFilter,
    title: 'Filter & Sort',
    text: 'Slice your list by status, sort by due date or title, and page through big lists without slowing down.',
  },
  {
    icon: Zap,
    title: 'Fast & Lightweight',
    text: 'Built with React and Vite. Instant updates, optimistic UI, and no bloat anywhere in the stack.',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    text: 'JWT-secured REST API with rate limiting and strict CORS. Your tasks are yours — nobody else can see them.',
  },
  {
    icon: Moon,
    title: 'Dark Mode',
    text: 'Easy on the eyes, day or night. Follows your system preference and remembers your choice.',
  },
  {
    icon: Smartphone,
    title: 'Works Everywhere',
    text: 'Fully responsive layout that feels right on phones, tablets, and desktops alike.',
  },
]

const steps = [
  {
    n: '01',
    title: 'Create your account',
    text: 'Sign up with just a name, email, and password. No credit card, no trial timers — free means free.',
  },
  {
    n: '02',
    title: 'Add your tasks',
    text: 'Capture what needs doing with titles, descriptions, due dates, and a starting status.',
  },
  {
    n: '03',
    title: 'Forge through your day',
    text: 'Move tasks through statuses as you work, filter what matters now, and watch the completed pile grow.',
  },
]

export function LandingPage() {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* ============ NAVBAR ============ */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
        <div className="container flex items-center justify-between py-3">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2">
            <span className="flex-center w-8 h-8 rounded-lg bg-blue-600 text-white">
              <Hammer size={16} />
            </span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">TaskForge</span>
          </a>

          {/* Center links (hidden on phones) */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white">Features</a>
            <a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white">How it works</a>
            <a href={API_DOCS_URL} target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white">API Docs</a>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary btn-sm">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-secondary btn-sm hidden sm:inline-flex">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary btn-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section id="top" className="relative overflow-hidden">
        {/* Soft radial glow behind the hero */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 h-[32rem] bg-gradient-to-b from-blue-100/80 via-blue-50/40 to-transparent dark:from-blue-950/50 dark:via-blue-950/20 dark:to-transparent"
        />

        <div className="container relative pt-16 pb-12 sm:pt-24 text-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Free & open source — no credit card required
          </span>

          {/* Headline */}
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
            Forge your day,
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
              one task at a time.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-400">
            TaskForge is a fast, focused task manager. Capture what needs doing,
            track progress without ceremony, and get things done — minus the clutter.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex-center flex-wrap gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-base">
                Welcome back, {user?.name?.split(' ')[0]}
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-base">
                  Start for free
                  <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn-secondary px-6 py-3 text-base">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* App preview card */}
          <div className="relative mx-auto mt-14 max-w-2xl">
            {/* Glow under the card */}
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-2xl"
            />
            <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden text-left">
              {/* Fake window chrome */}
              <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 px-4 py-3">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-slate-400">taskforge — dashboard</span>
              </div>

              {/* Fake task list */}
              <div className="p-4 sm:p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Your Tasks (3)</p>
                  <span className="text-xs text-slate-400">Sorted by: Recent</span>
                </div>
                {previewTasks.map((t) => (
                  <div
                    key={t.title}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-4 py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CheckCircle
                        size={18}
                        className={
                          t.status === 'completed'
                            ? 'text-green-500 shrink-0'
                            : 'text-slate-300 dark:text-slate-600 shrink-0'
                        }
                      />
                      <span
                        className={`truncate text-sm ${
                          t.status === 'completed'
                            ? 'text-slate-400 line-through'
                            : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {t.title}
                      </span>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${t.badgeClass}`}>
                      {t.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section id="features" className="container py-20 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">Features</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Everything you need. Nothing you don't.
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Task managers shouldn't need a manual. TaskForge keeps the surface small
            and the experience sharp.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900"
            >
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 font-bold text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="border-y border-slate-100 dark:border-slate-900 bg-slate-50/60 dark:bg-slate-900/40">
        <div className="container py-20 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">How it works</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Up and running in under a minute
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map(({ n, title, text }) => (
              <div key={n} className="relative">
                <span className="text-5xl font-bold text-blue-100 dark:text-blue-950 select-none">{n}</span>
                <h3 className="mt-3 font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA BANNER ============ */}
      <section className="container py-20 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-600 px-6 py-16 sm:px-16 text-center">
          {/* Decorative circles */}
          <div aria-hidden="true" className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-10 w-52 h-52 rounded-full bg-white/10" />

          <h2 className="relative text-3xl sm:text-4xl font-bold text-white">
            Ready to forge ahead?
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-blue-100">
            Join TaskForge today and turn your to-do pile into a done pile.
          </p>
          <div className="relative mt-8">
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-blue-700 shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              {isAuthenticated ? 'Open your dashboard' : 'Create your free account'}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
        <div className="container py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-2 max-w-sm">
              <div className="flex items-center gap-2">
                <span className="flex-center w-8 h-8 rounded-lg bg-blue-600 text-white">
                  <Hammer size={16} />
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">TaskForge</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                A fast, focused task manager built with the MERN stack —
                React, Express, MongoDB, and a JWT-secured REST API.
              </p>
              {/* Socials */}
              <div className="mt-5 flex items-center gap-3">
                <a
                  href="https://github.com/sh1v-max/Taskforge"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub repository"
                  className="flex-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <GithubIcon size={17} />
                </a>
                <a
                  href={API_DOCS_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="API documentation"
                  className="flex-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <BookOpen size={17} />
                </a>
                <a
                  href="mailto:singhshiv0427@gmail.com"
                  aria-label="Email the developer"
                  className="flex-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Mail size={17} />
                </a>
              </div>
            </div>

            {/* Product links */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Product</h4>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#features" className="hover:text-slate-900 dark:hover:text-white">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white">How it works</a></li>
                <li><Link to="/register" className="hover:text-slate-900 dark:hover:text-white">Sign up</Link></li>
                <li><Link to="/login" className="hover:text-slate-900 dark:hover:text-white">Sign in</Link></li>
              </ul>
            </div>

            {/* Developer links */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Developers</h4>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <a href={API_DOCS_URL} target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white">
                    API Documentation
                  </a>
                </li>
                <li>
                  <a href="https://github.com/sh1v-max/Taskforge" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white">
                    Source Code
                  </a>
                </li>
                <li>
                  <a href="https://github.com/sh1v-max" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white">
                    More Projects
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800 pt-6 text-sm text-slate-500 dark:text-slate-400">
            <p>© {new Date().getFullYear()} TaskForge. Built by Shiv.</p>
            <p className="flex items-center gap-1.5">
              Crafted with <span className="text-red-500">♥</span> using React, Express & MongoDB
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
