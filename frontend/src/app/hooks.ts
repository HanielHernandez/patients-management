'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  createPatient,
  deletePatient,
  getPatients,
  updatePatient,
} from '@/lib/patients';
import type { PatientListQuery } from '@/lib/patient-list-query';
import type { Patient, PatientsResponse } from '@/lib/types';
import type { PatientFormValues } from '@/lib/validations/patients';
import { useAuth } from '@/components/providers/auth-provider';

export function usePatients(query: PatientListQuery) {
  const { token } = useAuth();
  const { page, limit, search, sortBy, order } = query;
  const queryKey = `${token ?? ''}|${page}|${limit}|${search}|${sortBy}|${order}`;

  const [items, setItems] = useState<Patient[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [seenKey, setSeenKey] = useState(queryKey);
  const [generation, setGeneration] = useState(0);
  const [completedGeneration, setCompletedGeneration] = useState(-1);

  if (seenKey !== queryKey) {
    setSeenKey(queryKey);
    setGeneration((current) => current + 1);
  }

  const isLoading = completedGeneration !== generation;
  const error = isLoading ? null : errorMessage;

  useEffect(() => {
    if (!token) return;

    const authToken = token;
    let cancelled = false;
    const currentGeneration = generation;

    async function load() {
      try {
        const response: PatientsResponse = await getPatients(authToken, {
          page,
          limit,
          search,
          sortBy,
          order,
        });

        if (cancelled) return;

        setItems(response.data);
        setTotal(response.pagination.total);
        setTotalPages(response.pagination.totalPages);
        setErrorMessage(null);
        setCompletedGeneration(currentGeneration);
      } catch {
        if (cancelled) return;

        setErrorMessage('Unable to load patients. Please try again.');
        setCompletedGeneration(currentGeneration);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [generation, token, page, limit, search, sortBy, order]);

  const create = useCallback(async (data: PatientFormValues) => {
    if (!token) throw new Error('You must be authenticated');

    const patient = await createPatient(token, data);
    setGeneration((current) => current + 1);

    return patient;
  }, [token]);

  const update = useCallback(async (
    id: string,
    data: Partial<PatientFormValues>,
  ) => {
    if (!token) throw new Error('You must be authenticated');

    const patient = await updatePatient(token, id, data);
    setGeneration((current) => current + 1);

    return patient;
  }, [token]);

  const remove = useCallback(async (id: string) => {
    if (!token) throw new Error('You must be authenticated');

    await deletePatient(token, id);
    setGeneration((current) => current + 1);
  }, [token]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
    search,
    sortBy,
    order,
    isLoading,
    error,
    reload: () => setGeneration((current) => current + 1),
    create,
    update,
    remove,
  };
}