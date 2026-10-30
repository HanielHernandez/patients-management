'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiError } from '@/lib/api';
import {
  patientSchema,
  type PatientFormValues,
} from '@/lib/validations/patients';

interface PatientsFormProps {
  onSubmit?: (values: PatientFormValues) => Promise<void>;
  defaultValues?: PatientFormValues;
  isLoading?: boolean;
  readOnly?: boolean;
  submitLabel?: string;
  successMessage?: string;
}

function getSubmitErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return 'Please review the patient information and try again.';
      case 401:
        return 'Your session has expired. Please sign in again.';
      case 403:
        return 'You do not have permission to change patient records.';
      case 404:
        return 'The patient service could not be found. Please try again later.';
      case 409:
        return 'A patient with this email already exists.';
      default:
        if (error.status >= 500) {
          return 'The patient service is temporarily unavailable. Please try again later.';
        }

        return 'We could not save this patient. Please try again.';
    }
  }

  if (error instanceof TypeError) {
    return 'Unable to reach the patient service. Check your connection and try again.';
  }

  return 'We could not save this patient due to an unexpected error. Please try again.';
}

export default function PatientsForm({
  onSubmit,
  defaultValues,
  isLoading = false,
  readOnly = false,
  submitLabel = 'Save patient',
  successMessage = 'Patient saved successfully.',
}: PatientsFormProps) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues,
  });

  async function submit(values: PatientFormValues) {
    if (!onSubmit || readOnly) return;

    try {
      await onSubmit(values);
      toast.success(successMessage);
    } catch (error) {
      toast.error(getSubmitErrorMessage(error));
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(submit)} noValidate>
      <div>
        <h2 className="text-lg font-semibold">
          {readOnly ? 'Patient details' : 'Patient information'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {readOnly
            ? 'This record is read only.'
            : "Enter the patient's information below."}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="firstName">First name</Label>
        <Input
          id="firstName"
          autoComplete="given-name"
          disabled={readOnly}
          {...register('firstName')}
          aria-invalid={!!errors.firstName}
          aria-describedby={errors.firstName ? 'firstName-error' : undefined}
        />
        {errors.firstName && (
          <p id="firstName-error" className="text-sm text-destructive">
            {errors.firstName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Last name</Label>
        <Input
          id="lastName"
          autoComplete="family-name"
          disabled={readOnly}
          {...register('lastName')}
          aria-invalid={!!errors.lastName}
          aria-describedby={errors.lastName ? 'lastName-error' : undefined}
        />
        {errors.lastName && (
          <p id="lastName-error" className="text-sm text-destructive">
            {errors.lastName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          disabled={readOnly}
          {...register('email')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          autoComplete="tel"
          disabled={readOnly}
          {...register('phoneNumber')}
          aria-invalid={!!errors.phoneNumber}
          aria-describedby={
            errors.phoneNumber ? 'phoneNumber-error' : undefined
          }
        />
        {errors.phoneNumber && (
          <p id="phoneNumber-error" className="text-sm text-destructive">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dob">Date of birth</Label>
        <Input
          id="dob"
          type="date"
          disabled={readOnly}
          {...register('dob')}
          aria-invalid={!!errors.dob}
          aria-describedby={errors.dob ? 'dob-error' : undefined}
        />
        {errors.dob && (
          <p id="dob-error" className="text-sm text-destructive">
            {errors.dob.message}
          </p>
        )}
      </div>

      {readOnly ? null : (
        <Button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? 'Saving…' : submitLabel}
        </Button>
      )}
    </form>
  );
}
