import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-xs text-slate-400', className)}>
      <ol className="flex items-center space-x-1.5 flex-wrap">
        <li>
          <Link
            to="/dashboard"
            className="flex items-center text-slate-400 hover:text-devhub-400 transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center space-x-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-slate-600 flex-shrink-0" />
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className="hover:text-slate-200 transition-colors flex items-center gap-1 text-slate-400 truncate max-w-[150px]"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className="font-semibold text-slate-200 flex items-center gap-1 truncate max-w-[200px]">
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
