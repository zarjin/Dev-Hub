export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface SelectOption<T = string> {
  label: string;
  value: T;
  icon?: string;
  description?: string;
}

export type SortOrder = 'asc' | 'desc';

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}
