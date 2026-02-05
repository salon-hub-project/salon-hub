import type { Metadata } from 'next';
import RenewalsInteractive from './components/RenewalsInteractive';

export const metadata: Metadata = {
  title: 'Renewals Management - SalonCRM',
  description: 'Track, process, and analyze subscription renewals across all salon locations with comprehensive renewal workflow management and payment tracking.',
};

export default function RenewalsManagementPage() {
  return (
    <>
      <main className="min-h-screen bg-background p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <RenewalsInteractive />
        </div>
      </main>
    </>
  );
}