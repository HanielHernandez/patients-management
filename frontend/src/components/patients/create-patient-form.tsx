import type { PatientFormValues } from '@/lib/validations/patients';
import PatientsForm from './patients-form';

interface CreatePatientFormProps {
  onCreate: (values: PatientFormValues) => Promise<void>;
  isLoading: boolean;
}

export default function CreatePatientForm({
  onCreate,
  isLoading,
}: CreatePatientFormProps) {
  return (
    <PatientsForm
      onSubmit={onCreate}
      isLoading={isLoading}
      submitLabel="Create patient"
      successMessage="Patient created successfully."
    />
  );
}
