'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  parsePatientListQuery,
  serializePatientListQuery,
  type PatientListQuery,
} from '@/lib/patient-list-query';
import type { PatientSortField, PatientSortOrder } from '@/lib/patients';

export function usePatientListQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rawQuery = searchParams.toString();

  const query = useMemo(
    () => parsePatientListQuery(new URLSearchParams(rawQuery)),
    [rawQuery],
  );

  const writeQuery = useCallback((
    next: PatientListQuery,
    history: 'push' | 'replace',
  ) => {
    const serialized = serializePatientListQuery(next);

    if (serialized === rawQuery) return;

    const href = `${pathname}?${serialized}`;

    if (history === 'push') {
      router.push(href, { scroll: false });
      return;
    }

    router.replace(href, { scroll: false });
  }, [pathname, rawQuery, router]);

  useEffect(() => {
    writeQuery(query, 'replace');
  }, [query, writeQuery]);

  const setPage = useCallback((page: number) => {
    writeQuery({ ...query, page }, 'push');
  }, [query, writeQuery]);

  const setLimit = useCallback((limit: number) => {
    writeQuery({ ...query, limit, page: 1 }, 'push');
  }, [query, writeQuery]);

  const setSearch = useCallback((search: string) => {
    writeQuery({ ...query, search, page: 1 }, 'replace');
  }, [query, writeQuery]);

  const setSorting = useCallback((
    sortBy: PatientSortField,
    order: PatientSortOrder,
  ) => {
    writeQuery({ ...query, sortBy, order, page: 1 }, 'push');
  }, [query, writeQuery]);

  return {
    query,
    setPage,
    setLimit,
    setSearch,
    setSorting,
  };
}
