import React from 'react';
import { cn } from '../../lib/utils';
import { TableColumn } from '../../types/common';
import { Skeleton } from './Skeleton';

export interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T extends { _id?: string; id?: string }>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No records found',
  onRowClick,
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full space-y-2 p-2">
        <Skeleton height={36} className="w-full" />
        <Skeleton height={48} className="w-full" />
        <Skeleton height={48} className="w-full" />
        <Skeleton height={48} className="w-full" />
      </div>
    );
  }

  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border border-surface-border bg-surface-card', className)}>
      <table className="w-full text-left text-xs text-slate-200">
        <thead className="bg-surface-elevated/70 text-slate-400 font-semibold border-b border-surface-border uppercase tracking-wider text-[11px]">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={cn('py-3 px-4', col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border/60">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-slate-400 text-xs">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => {
              const rowKey = item._id || item.id || `row-${index}`;
              return (
                <tr
                  key={rowKey}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    'transition-colors hover:bg-surface-elevated/50',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn('py-3 px-4 align-middle', col.className)}>
                      {col.render
                        ? col.render(item)
                        : (item as Record<string, unknown>)[col.key] !== undefined
                        ? String((item as Record<string, unknown>)[col.key])
                        : null}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
