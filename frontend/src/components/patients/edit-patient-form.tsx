import PatientsForm from '@/components/patients/patients-form';
import type { Patient } from '@/lib/types';
import type { PatientFormValues } from '@/lib/validations/patients';

interface EditPatientFormProps {
  patient: Patient;
  isLoading?: boolean;
  readOnly?: boolean;
  onUpdate?: (id: string, values: PatientFormValues) => Promise<void>;
}

export default function EditPatientForm({
  patient,
  isLoading = false,
  readOnly = false,
  onUpdate,
}: EditPatientFormProps) {
  const defaultValues: PatientFormValues = {
    firstName: patient.firstName,
    lastName: patient.lastName,
    email: patient.email,
    phoneNumber: patient.phoneNumber,
    dob: patient.dob.slice(0, 10),
  };

  return (
    <PatientsForm
      defaultValues={defaultValues}
      isLoading={isLoading}
      readOnly={readOnly}
      onSubmit={
        onUpdate ? (values) => onUpdate(patient.id, values) : undefined
      }
      submitLabel="Save changes"
      successMessage="Patient updated successfully."
    />
  );
}
