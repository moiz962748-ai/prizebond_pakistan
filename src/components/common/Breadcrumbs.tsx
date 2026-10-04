import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="w-full overflow-x-auto whitespace-nowrap py-2 scrollbar-none">
      <div className="flex items-center text-xs text-emerald-900/70 font-medium">
        <button
          onClick={items[0]?.onClick}
          className="flex items-center gap-1 hover:text-emerald-700 transition-colors cursor-pointer shrink-0"
          aria-label="Home"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        {items.map((item, index) => (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 mx-1.5 text-slate-400 shrink-0" />
            {item.onClick && index < items.length - 1 ? (
              <button
                onClick={item.onClick}
                className="hover:text-emerald-700 hover:underline transition-colors cursor-pointer shrink-0"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-emerald-950 font-semibold text-slate-800 shrink-0 truncate">
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};