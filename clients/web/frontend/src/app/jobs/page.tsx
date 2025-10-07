import { AppShell } from '@/components/layout/AppShell';
import { JobsTable } from '@/components/jobs/JobsTable';

export default function JobsPage() {
  return (
    <AppShell>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestion des Jobs
            </h1>
            <p className="text-gray-600">
              Suivez et gérez vos analyses en cours et terminées.
            </p>
          </div>
          
          <JobsTable />
        </div>
      </div>
    </AppShell>
  );
}