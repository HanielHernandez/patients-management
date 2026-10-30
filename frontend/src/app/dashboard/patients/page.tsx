import { Suspense } from 'react';
import { PatientsSection } from '@/components/patients/patients-section';

export default function PatientsPage() {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-muted-foreground">Loading patients...</p>
      }
    >
      <PatientsSection />
    </Suspense>
  );
}
