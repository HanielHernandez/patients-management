import {
  isPatientSortField,
  type PatientSortField,
  type PatientSortOrder,
} from '@/lib/patients';

export interface PatientListQuery {
  page: number;
  limit: number;
  search: string;
  sortBy: PatientSortField;
  order: PatientSortOrder;
}

export const defaultPatientListQuery: PatientListQuery = {
  page: 1,
  limit: 10,
  search: '',
  sortBy: 'lastName',
  order: 'asc',
};

function readPositiveInt(value: string | null, fallback: number, max: number) {
  if (value == null || value.trim() === '') return fallback;

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) {
    return fallback;
  }

  return parsed;
}

export function parsePatientListQuery(params: URLSearchParams): PatientListQuery {
  const sortBy = params.get('sortBy') ?? '';
  const order = params.get('order');
  const search = params.get('search') ?? '';

  return {
    page: readPositiveInt(params.get('page'), defaultPatientListQuery.page, 10_000),
    limit: readPositiveInt(params.get('limit'), defaultPatientListQuery.limit, 100),
    search: search.slice(0, 100),
    sortBy: isPatientSortField(sortBy) ? sortBy : defaultPatientListQuery.sortBy,
    order: order === 'desc' ? 'desc' : 'asc',
  };
}

export function serializePatientListQuery(query: PatientListQuery) {
  const params = new URLSearchParams();

  params.set('page', String(query.page));
  params.set('limit', String(query.limit));
  params.set('search', query.search);
  params.set('sortBy', query.sortBy);
  params.set('order', query.order);

  return params.toString();
}
