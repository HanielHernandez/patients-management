'use client';

import type { ReactNode } from 'react';
import { useTable, type PaginationState, type SortingState } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table/data-table';
import { dataTableFeatures } from '@/components/data-table/data-table-features';
import {
  DataTablePagination,
  type PaginationOptions,
} from '@/components/data-table/data-table-pagination';
import { patientColumns } from '@/components/patients/columns';
import {
  isPatientSortField,
  type PatientSortField,
  type PatientSortOrder,
} from '@/lib/patients';
import type { Patient } from '@/lib/types';

const emptyPatientsMessage = (
  <div>
    <p className="font-medium">No patients found</p>
    <p className="text-sm text-muted-foreground">
      Try adjusting your search or add a patient.
    </p>
  </div>
);

export interface PatientsTableOptions extends PaginationOptions {
  sortBy: PatientSortField;
  order: PatientSortOrder;
  onSort: (field: PatientSortField, order: PatientSortOrder) => void;
}

interface PatientsTableProps {
  patients: Patient[];
  isLoading: boolean;
  options: PatientsTableOptions;
  onView?: (patient: Patient) => void;
  onEdit?: (patient: Patient) => void;
  onDelete?: (patient: Patient) => void;
  emptyMessage?: ReactNode;
}

export function PatientsTable({
  patients,
  isLoading,
  options,
  onView,
  onEdit,
  onDelete,
  emptyMessage = emptyPatientsMessage,
}: PatientsTableProps) {
  const { page, limit, total, totalPages, sortBy, order, onSort, onPageChange, onLimitChange } = options;
  const sorting: SortingState = [{ id: sortBy, desc: order === 'desc' }];
  const pagination: PaginationState = {
    pageIndex: Math.max(page, 1) - 1,
    pageSize: limit,
  };

  const table = useTable({
    features: dataTableFeatures,
    data: patients,
    columns: patientColumns({ onView, onEdit, onDelete }),
    getRowId: (row) => row.id,
    manualPagination: true,
    manualSorting: true,
    enableSortingRemoval: false,
    enableMultiSort: false,
    sortDescFirst: false,
    autoResetPageIndex: false,
    pageCount: totalPages,
    rowCount: total,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater;
      const nextSort = next[0];

      if (!nextSort || !isPatientSortField(nextSort.id)) return;

      onSort(nextSort.id, nextSort.desc ? 'desc' : 'asc');
    },
    onPaginationChange: (updater) => {
      const next = typeof updater === 'function' ? updater(pagination) : updater;

      if (next.pageSize !== limit) {
        onLimitChange(next.pageSize);
        return;
      }

      const nextPage = next.pageIndex + 1;

      if (nextPage !== page) {
        onPageChange(nextPage);
      }
    },
  });

  return (
    <div className="space-y-4">
      <DataTable
        table={table}
        isLoading={isLoading}
        emptyMessage={emptyMessage}
      />
      <DataTablePagination
        options={options}
        totalLabel={total === 1 ? 'patient' : 'patients'}
      />
    </div>
  );
}
