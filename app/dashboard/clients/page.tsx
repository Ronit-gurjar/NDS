// app/dashboard/clients/page.tsx
import { ClientDataTable } from '@/components/clients/client-data-table'; // Updated import path
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ClientsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Clients Overview</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Registered Users</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientDataTable /> {/* Use the new component */}
        </CardContent>
      </Card>
    </div>
  );
}