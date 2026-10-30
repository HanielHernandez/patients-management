'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Button } from '@/components/ui/button';
import type { DataTableFeatures } from '@/components/data-table/data-table-features';
import type { Patient } from '@/lib/types';

const columnHelper = createColumnHelper<DataTableFeatures, Patient>();

interface PatientColumnActions {
  onView?: (patient: Patient) => void;
  onEdit?: (patient: Patient) => void;
  onDelete?: (patient: Patient) => void;
}

export function patientColumns({
  onView,
  onEdit,
  onDelete,
}: PatientColumnActions = {}) {
  const showActions = Boolean(onView || onEdit || onDelete);

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
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date of birth" />
      ),
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
    ...(showActions
      ? [
          columnHelper.display({
            id: 'actions',
            header: 'Actions',
            enableSorting: false,
            cell: ({ row }) => {
              const name = `${row.original.firstName} ${row.original.lastName}`;

              return (
                <div className="flex items-center gap-1">
                  {onView ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`View ${name}`}
                      title="View patient"
                      onClick={() => onView(row.original)}
                    >
                      <Eye aria-hidden="true" />
                    </Button>
                  ) : null}
                  {onEdit ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${name}`}
                      title="Edit patient"
                      onClick={() => onEdit(row.original)}
                    >
                      <Pencil aria-hidden="true" />
                    </Button>
                  ) : null}
                  {onDelete ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive"
                      aria-label={`Delete ${name}`}
                      title="Delete patient"
                      onClick={() => onDelete(row.original)}
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  ) : null}
                </div>
              );
            },
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
