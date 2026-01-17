'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import SearchBar from '@/components/patients/SearchBar';
import FilterPanel, { FilterValues } from '@/components/patients/FilterPanel';
import PatientTable from '@/components/patients/PatientTable';
import FilterChips from '@/components/patients/FilterChips';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Users } from 'lucide-react';
import { usePatientSearch, SearchFilters } from '@/hooks/usePatients';

export default function PatientsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterValues>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [page, setPage] = useState(1);

  // Build search filters
  const searchFilters: SearchFilters = {
    q: searchQuery || undefined,
    dateRange: filters.dateRange,
    startDate: filters.startDate,
    endDate: filters.endDate,
    month: filters.month,
    year: filters.year,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    page,
    limit: 20,
  };

  const { data, isLoading, error } = usePatientSearch(searchFilters);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1); // Reset to first page on new search
  };

  const handleFiltersChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page on filter change
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setPage(1);
  };

  const handleRemoveFilter = (key: keyof FilterValues | 'search') => {
    if (key === 'search') {
      setSearchQuery('');
    } else if (key === 'startDate' || key === 'endDate') {
      setFilters({
        ...filters,
        startDate: undefined,
        endDate: undefined,
        dateRange: undefined,
      });
    } else {
      setFilters({
        ...filters,
        [key]: undefined,
      });
    }
    setPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    filters.dateRange ||
    filters.month ||
    filters.year ||
    filters.startDate ||
    filters.endDate;

  const patients = data?.patients || [];
  const pagination = data?.pagination;

  return (
    <AppLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              All Patients
            </h1>
            <p className="text-muted-foreground mt-2">
              {pagination
                ? `Showing ${(pagination.page - 1) * pagination.limit + 1}-${Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )} of ${pagination.total} patients`
                : 'Search and manage all your patients'}
            </p>
          </div>
          <Button onClick={() => router.push('/patients/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Patient
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar value={searchQuery} onChange={handleSearchChange} />
        </div>

        {/* Filter Panel */}
        <div className="mb-6">
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="mb-6">
            <FilterChips
              filters={filters}
              searchQuery={searchQuery}
              onRemoveFilter={handleRemoveFilter}
            />
          </div>
        )}

        {/* Results Count */}
        {data && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {searchQuery && (
                <>
                  Found <span className="font-semibold">{pagination?.total || 0}</span> patient
                  {pagination?.total !== 1 ? 's' : ''} matching "{searchQuery}"
                </>
              )}
              {!searchQuery && hasActiveFilters && (
                <>
                  Found <span className="font-semibold">{pagination?.total || 0}</span> patient
                  {pagination?.total !== 1 ? 's' : ''} matching your filters
                </>
              )}
              {!searchQuery && !hasActiveFilters && (
                <>
                  Total <span className="font-semibold">{pagination?.total || 0}</span> patient
                  {pagination?.total !== 1 ? 's' : ''}
                </>
              )}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-8 text-center">
              <p className="text-red-600">Failed to load patients. Please try again.</p>
            </CardContent>
          </Card>
        )}

        {/* Patient Table */}
        {!error && <PatientTable patients={patients} isLoading={isLoading} />}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Empty State - No patients at all */}
        {!isLoading && !error && patients.length === 0 && !hasActiveFilters && (
          <Card className="mt-6">
            <CardContent className="py-16 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No patients yet</h3>
              <p className="text-muted-foreground mb-6">
                Get started by adding your first patient
              </p>
              <Button onClick={() => router.push('/patients/new')}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Patient
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
