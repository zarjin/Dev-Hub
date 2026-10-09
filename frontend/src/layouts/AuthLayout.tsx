import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

const currentYear = new Date().getFullYear();

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 bg-surface-darkest relative overflow-hidden">
      {/* Subtle background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-devhub-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Brand logo header */}
      <div className="mb-6 z-10 text-center">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-devhub-600 to-indigo-500 flex items-center justify-center shadow-glow text-white">
            <Layers className="h-5 w-5" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">
            DevHub
          </span>
        </Link>
        <p className="text-xs text-slate-400 mt-1">
          Modern engineering team collaboration &amp; project platform
        </p>
      </div>

      {/* Auth Card Container */}
      <div className="w-full max-w-md bg-surface-card/90 border border-surface-borderLight rounded-2xl shadow-2xl backdrop-blur-xl p-6 sm:p-8 z-10 animate-slide-up">
        <Outlet />
      </div>

      {/* Footer text */}
      <div className="mt-8 text-center text-xs text-slate-400 z-10">
        &copy; {currentYear} DevHub SaaS. Built for software development teams.
      </div>
    </div>
  );
};
