'use client';

import { useEffect, useState } from 'react';
import { PatientsTable } from '@/components/patients/patients-table';
import { DeletePatientDialog } from '@/components/patients/delete-patient-dialog';
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
import { Dialog, DialogContent } from '../ui/dialog';
import CreatePatientForm from './create-patient-form';
import EditPatientForm from './edit-patient-form';
import { useAuth } from '../providers/auth-provider';
import type { Patient } from '@/lib/types';
import { UserPlus } from 'lucide-react';

export function PatientsSection() {
  const { query, setPage, setLimit, setSearch, setSorting } =
    usePatientListQuery();
  const {
    items,
    pagination,
    isLoading,
    isCreating,
    isUpdating,
    error,
    reload,
    create,
    update,
    remove,
  } = usePatients(query);
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const isUser = user?.role === 'USER';
  const [searchInput, setSearchInput] = useState(query.search);
  const [appliedSearch, setAppliedSearch] = useState(query.search);
  const [writtenSearch, setWrittenSearch] = useState(query.search);
  const [showCreatePatientForm, setShowCreatePatientForm] = useState(false);
  const [patientToView, setPatientToView] = useState<Patient | null>(null);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

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
        <div className="flex flex-col md:flex-row  gap-4 md:justify-between">
          <div className="w-full md:max-w-md">
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
          {isAdmin && (
            <Button onClick={() => setShowCreatePatientForm(true)}>
              <UserPlus aria-hidden="true" />
              Create Patient
            </Button>
          )}
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
          onView={isUser ? setPatientToView : undefined}
          onEdit={isAdmin ? setPatientToEdit : undefined}
          onDelete={isAdmin ? setPatientToDelete : undefined}
          options={{
            ...pagination,
            sortBy: query.sortBy,
            order: query.order,
            onPageChange: setPage,
            onLimitChange: setLimit,
            onSort: setSorting,
          }}
          emptyMessage={error ? 'Patients could not be loaded.' : undefined}
        />
      </CardContent>

      {isAdmin && showCreatePatientForm && (
        <Dialog
          open={showCreatePatientForm}
          onOpenChange={setShowCreatePatientForm}
        >
          <DialogContent>
            <CreatePatientForm
              isLoading={isCreating}
              onCreate={async (values) => {
                await create(values);
                setShowCreatePatientForm(false);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {isAdmin && patientToDelete ? (
        <DeletePatientDialog
          patient={patientToDelete}
          onClose={() => setPatientToDelete(null)}
          onDelete={remove}
        />
      ) : null}

      {isUser && patientToView ? (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) setPatientToView(null);
          }}
        >
          <DialogContent>
            <EditPatientForm patient={patientToView} readOnly />
          </DialogContent>
        </Dialog>
      ) : null}

      {isAdmin && patientToEdit && (
        <Dialog
          open={!!patientToEdit}
          onOpenChange={(open) => {
            if (!open) setPatientToEdit(null);
          }}
        >
          <DialogContent>
            <EditPatientForm
              patient={patientToEdit}
              isLoading={isUpdating}
              onUpdate={async (id, values) => {
                await update(id, values);
                setPatientToEdit(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
