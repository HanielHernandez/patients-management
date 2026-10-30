'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/auth-provider';
import type { Patient } from '@/lib/types';

interface DeletePatientDialogProps {
  patient: Patient;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
}

export function DeletePatientDialog({
  patient,
  onClose,
  onDelete,
}: DeletePatientDialogProps) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <AlertDialog
      open
      onOpenChange={(open) => {
        if (!open && !isDeleting) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete patient</AlertDialogTitle>
          <AlertDialogDescription>
            Delete {patient.firstName} {patient.lastName}? This cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={() => {
              if (user?.role !== 'ADMIN') {
                toast.error('You do not have permission to delete patients.');
                onClose();
                return;
              }

              setIsDeleting(true);

              void onDelete(patient.id)
                .then(() => {
                  toast.success('Patient deleted.');
                  onClose();
                })
                .catch(() => {
                  toast.error(
                    'Unable to delete this patient. Please try again.',
                  );
                })
                .finally(() => {
                  setIsDeleting(false);
                });
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
