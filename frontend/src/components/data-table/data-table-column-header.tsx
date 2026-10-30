'use client';

import type { Column, RowData } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DataTableFeatures } from '@/components/data-table/data-table-features';

interface DataTableColumnHeaderProps<TData extends RowData, TValue> {
  column: Column<DataTableFeatures, TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData extends RowData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span>{title}</span>;
  }

  const sorted = column.getIsSorted();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-2 h-8 px-2"
      onClick={() => column.toggleSorting()}
      aria-label={`Sort by ${title}`}
    >
      {title}
      {sorted === 'desc' ? (
        <ArrowDown aria-hidden="true" />
      ) : sorted === 'asc' ? (
        <ArrowUp aria-hidden="true" />
      ) : (
        <ChevronsUpDown aria-hidden="true" />
      )}
    </Button>
  );
}
