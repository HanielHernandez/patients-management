'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { Pencil } from 'lucide-react';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Button } from '@/components/ui/button';
import type { DataTableFeatures } from '@/components/data-table/data-table-features';
import type { Patient } from '@/lib/types';

const columnHelper = createColumnHelper<DataTableFeatures, Patient>();

export function patientColumns(onEdit?: (patient: Patient) => void) {
  return columnHelper.columns([
    columnHelper.accessor('firstName', {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="First name" />
      ),
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue()}</span>
      ),
    }),
    columnHelper.accessor('lastName', {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last name" />
      ),
    }),
    columnHelper.accessor('email', {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    }),
    columnHelper.accessor('phoneNumber', {
      header: 'Phone',
      enableSorting: false,
    }),
    columnHelper.accessor('dob', {
      header: 'Date of birth',
      enableSorting: false,
      cell: ({ getValue }) => formatDate(getValue()),
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? formatDate(value) : '—';
      },
    }),
    ...(onEdit
      ? [
          columnHelper.accessor('id', {
            id: 'actions',
            header: 'Actions',
            enableSorting: false,
            cell: ({ row }) => (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Edit ${row.original.firstName} ${row.original.lastName}`}
                title="Edit patient"
                onClick={() => onEdit(row.original)}
              >
                <Pencil aria-hidden="true" />
              </Button>
            ),
          }),
        ]
      : []),
  ]);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
