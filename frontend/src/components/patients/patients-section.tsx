'use client';

import { useEffect, useState } from 'react';
import { PatientsTable } from '@/components/patients/patients-table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { usePatients } from '@/app/hooks';
import { usePatientListQuery } from '@/hooks/use-patient-list-query';

export function PatientsSection() {
  const { query, setPage, setLimit, setSearch, setSorting } = usePatientListQuery();
  const {
    items,
    pagination,
    isLoading,
    error,
    reload,
  } = usePatients(query);
  const [searchInput, setSearchInput] = useState(query.search);
  const [appliedSearch, setAppliedSearch] = useState(query.search);
  const [writtenSearch, setWrittenSearch] = useState(query.search);

  if (query.search !== appliedSearch) {
    setAppliedSearch(query.search);

    if (query.search !== writtenSearch) {
      setSearchInput(query.search);
      setWrittenSearch(query.search);
    }
  }

  useEffect(() => {
    if (searchInput === query.search) return;

    const timeout = window.setTimeout(() => {
      setWrittenSearch(searchInput);
      setSearch(searchInput);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [query.search, searchInput, setSearch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patients</CardTitle>
        <CardDescription>
          Search, sort, and page through patient records.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-w-sm">
          <label htmlFor="patient-search" className="sr-only">
            Search patients
          </label>
          <Input
            id="patient-search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by name or email"
          />
        </div>

        {error ? (
          <div className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p>{error}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => reload()}
            >
              Try again
            </Button>
          </div>
        ) : null}

        <PatientsTable
          patients={items}
          isLoading={isLoading}
          options={{
            ...pagination,
            sortBy: query.sortBy,
            order: query.order,
            onPageChange: setPage,
            onLimitChange: setLimit,
            onSort: setSorting,
          }}
          emptyMessage={
            error ? 'Patients could not be loaded.' : undefined
          }
        />
      </CardContent>
    </Card>
  );
}
