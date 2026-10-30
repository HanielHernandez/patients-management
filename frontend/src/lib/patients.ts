import { apiRequest } from '@/lib/api';
import type { Patient, PatientsResponse } from '@/lib/types';

export type PatientSortField =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'dob'
  | 'createdAt';
export type PatientSortOrder = 'asc' | 'desc';

export interface GetPatientsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: PatientSortField;
  order?: PatientSortOrder;
}

const patientSortFields: readonly PatientSortField[] = [
  'firstName',
  'lastName',
  'email',
  'dob',
  'createdAt',
];

export function isPatientSortField(value: string): value is PatientSortField {
  return patientSortFields.some((field) => field === value);
}

export async function getPatients(
  token: string,
  params: GetPatientsParams = {},
) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.set(key, String(value));
    }
  });

  return apiRequest<PatientsResponse>(
    `/patients?${query.toString()}`,
    {},
    token,
  );
}

export function createPatient(
  token: string,
  data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>,
) {
  return apiRequest<Patient>(
    '/patients',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token,
  );
}

export function updatePatient(
  token: string,
  id: string,
  data: Partial<Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>>,
) {
  return apiRequest<Patient>(
    `/patients/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
    token,
  );
}

export function deletePatient(token: string, id: string) {
  return apiRequest<{ message: string }>(
    `/patients/${id}`,
    { method: 'DELETE' },
    token,
  );
}