import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users2,
  Sparkles,
  GitPullRequest,
  Terminal,
} from 'lucide-react';

const currentYear = new Date().getFullYear();

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-darkest text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-devhub-500/15 via-indigo-600/5 to-transparent blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="border-b border-surface-border/60 bg-surface-darkest/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-devhub-600 to-indigo-500 flex items-center justify-center shadow-glow text-white">
            <Layers className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
            DevHub
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-devhub-500/20 text-devhub-300 border border-devhub-500/30">
              v2.4
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <a href="#features" className="hover:text-devhub-400 transition-colors">Features</a>
          <a href="#hierarchy" className="hover:text-devhub-400 transition-colors">Hierarchy</a>
          <a href="#workflow" className="hover:text-devhub-400 transition-colors">Workflow</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link to="/dashboard">
            <Button size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
              Open App
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 lg:py-24 flex flex-col items-center text-center z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-devhub-500/10 border border-devhub-500/30 text-devhub-300 text-xs font-medium mb-8 animate-fade-in">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Next-Generation Developer Collaboration &amp; Project Management</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1] mb-6">
          The SaaS Command Center for{' '}
          <span className="bg-gradient-to-r from-devhub-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            High-Velocity Engineering Teams
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed">
          From organizational scopes to teams, tasks, and role-enforced reviews.
          Organize your software roadmap with strict team lead approvals, audit timelines, and dark-first aesthetics.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Link to="/dashboard">
            <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />} className="px-8 shadow-glow">
              Launch Live Workspace
            </Button>
          </Link>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="px-8">
              Create Free Account
            </Button>
          </Link>
        </div>

        {/* Hero Interactive Mock Preview Card */}
        <div className="w-full max-w-5xl rounded-2xl border border-surface-border bg-surface-card/70 p-4 sm:p-6 shadow-2xl backdrop-blur-xl relative">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-border">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2">devhub.app / zarjin-technologies / frontend-team</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-devhub-400">
              <Terminal className="h-3.5 w-3.5" />
              <span>status: production ready</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-xl bg-surface-elevated/70 border border-surface-borderLight">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">In Progress</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">3 tasks</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-card border border-surface-border text-xs mb-2">
                <p className="font-semibold text-slate-100">Architect Glassmorphic Kanban Board</p>
                <p className="text-slate-400 text-[11px] mt-1">Assignee: Karim Rahman</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-card border border-surface-border text-xs">
                <p className="font-semibold text-slate-100">Integrate Redux Toolkit Slice</p>
                <p className="text-slate-400 text-[11px] mt-1">Assignee: Alex Rivera</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-elevated/70 border border-amber-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Pending Review</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">Requires Lead</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-card border border-amber-500/30 text-xs">
                <p className="font-semibold text-slate-100">Dark-First Design System Tokens</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-surface-border text-[11px]">
                  <span className="text-amber-400">Awaiting Zarjin's Review</span>
                  <span className="text-slate-400">#101</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-elevated/70 border border-emerald-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Completed</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Approved</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-card border border-emerald-500/30 text-xs">
                <p className="font-semibold text-slate-100">Audit WCAG 2.1 Accessibility</p>
                <p className="text-emerald-400 text-[11px] mt-1 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Approved by Team Lead
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Hierarchy Section */}
        <section id="hierarchy" className="mt-28 w-full max-w-4xl text-left">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Strict Multi-Tenant Engineering Hierarchy
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Structured from the top organization level down to atomic task reviews
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-surface-card border border-surface-border">
              <div className="p-2.5 rounded-lg bg-devhub-500/10 text-devhub-400 w-fit mb-3">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Organization</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Companies, startups, or agencies with owner, admin, and member tiers.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-surface-card border border-surface-border">
              <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 w-fit mb-3">
                <Users2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Teams</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated engineering pods: Frontend, Backend, Full Stack, QA, and DevOps.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-surface-card border border-surface-border">
              <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 w-fit mb-3">
                <GitPullRequest className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Tasks</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Granular work tickets with priorities, assignees, deadlines, and comments.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-surface-card border border-surface-border">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 w-fit mb-3">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Lead Review</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Formal review pipeline: Developers cannot approve their own work.
              </p>
            </div>
          </div>
        </section>

        {/* Workflow Pipeline */}
        <section id="workflow" className="mt-28 w-full max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
            The DevHub Workflow Engine
          </h2>
          <p className="text-sm text-slate-400 mb-10">
            A developer transitions TODO &rarr; IN PROGRESS &rarr; PENDING REVIEW. Only a team lead approves or requests changes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 p-6 rounded-2xl bg-surface-card border border-surface-border text-xs font-mono">
            <span className="px-3 py-1.5 rounded-lg bg-surface-elevated text-slate-300 border border-surface-border">
              TODO
            </span>
            <ArrowRight className="h-4 w-4 text-slate-500" />
            <span className="px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-300 border border-blue-500/30">
              IN_PROGRESS
            </span>
            <ArrowRight className="h-4 w-4 text-slate-500" />
            <span className="px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30">
              PENDING_REVIEW
            </span>
            <ArrowRight className="h-4 w-4 text-slate-500" />
            <div className="flex flex-col gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                COMPLETED
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30">
                CHANGES_REQUESTED
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border/60 py-8 px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-devhub-500" />
            <span className="font-semibold text-slate-200">DevHub Technologies</span>
          </div>
          <p>&copy; {currentYear} DevHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
