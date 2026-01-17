'use client';

import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';

export default function SearchPatientsPage() {
  return (
    <AppLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Search className="h-8 w-8 text-primary" />
            Search Patients
          </h1>
          <p className="text-muted-foreground mt-2">
            Advanced search functionality
          </p>
        </div>

        <Card>
          <CardContent className="py-16 text-center">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Search functionality available in All Patients</h3>
            <p className="text-muted-foreground">
              Please use the "All Patients" page to search and filter patients.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
