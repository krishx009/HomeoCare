'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterValues {
  dateRange?: 'today' | 'week' | 'month' | 'year' | 'custom';
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
  sortBy?: 'name' | 'age' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

interface FilterPanelProps {
  filters: FilterValues;
  onFiltersChange: (filters: FilterValues) => void;
  onClearFilters: () => void;
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

export default function FilterPanel({
  filters,
  onFiltersChange,
  onClearFilters,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters =
    filters.dateRange ||
    filters.month !== undefined ||
    filters.year !== undefined ||
    filters.startDate ||
    filters.endDate;

  const updateFilter = (key: keyof FilterValues, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="border-2">
      <CardHeader
        className="cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle className="text-lg">Filters</CardTitle>
            {hasActiveFilters && (
              <span className="ml-2 inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                Active
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearFilters();
                }}
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6 pt-6">
          {/* Quick Date Range Filters */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Registration Date</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
                { value: 'year', label: 'This Year' },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={filters.dateRange === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateFilter('dateRange', option.value)}
                  className="w-full"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Date Range */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Custom Date Range</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">From Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => {
                    updateFilter('startDate', e.target.value);
                    updateFilter('dateRange', 'custom');
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">To Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => {
                    updateFilter('endDate', e.target.value);
                    updateFilter('dateRange', 'custom');
                  }}
                />
              </div>
            </div>
          </div>

          {/* Month Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Filter by Month</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Select
                  value={filters.month?.toString()}
                  onValueChange={(value) => updateFilter('month', parseInt(value))}
                >
                  <SelectTrigger id="month">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem key={index} value={(index + 1).toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthYear">Year</Label>
                <Select
                  value={filters.year?.toString() || currentYear.toString()}
                  onValueChange={(value) => updateFilter('year', parseInt(value))}
                >
                  <SelectTrigger id="monthYear">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Year Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Filter by Year</Label>
            <Select
              value={filters.year?.toString()}
              onValueChange={(value) => updateFilter('year', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Options */}
          <div className="space-y-3 border-t pt-6">
            <Label className="text-base font-semibold">Sort By</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sortBy">Field</Label>
                <Select
                  value={filters.sortBy || 'createdAt'}
                  onValueChange={(value: any) => updateFilter('sortBy', value)}
                >
                  <SelectTrigger id="sortBy">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="age">Age</SelectItem>
                    <SelectItem value="createdAt">Registration Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Order</Label>
                <Select
                  value={filters.sortOrder || 'desc'}
                  onValueChange={(value: any) => updateFilter('sortOrder', value)}
                >
                  <SelectTrigger id="sortOrder">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">
                      {filters.sortBy === 'name' ? 'A to Z' : 'Low to High'}
                    </SelectItem>
                    <SelectItem value="desc">
                      {filters.sortBy === 'name' ? 'Z to A' : 'High to Low'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
