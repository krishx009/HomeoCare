'use client';

import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { FilterValues } from './FilterPanel';

interface FilterChipsProps {
  filters: FilterValues;
  searchQuery: string;
  onRemoveFilter: (key: keyof FilterValues | 'search') => void;
}

export default function FilterChips({
  filters,
  searchQuery,
  onRemoveFilter,
}: FilterChipsProps) {
  const getDateRangeLabel = (range: string) => {
    const labels: Record<string, string> = {
      today: 'Today',
      week: 'This Week',
      month: 'This Month',
      year: 'This Year',
      custom: 'Custom Range',
    };
    return labels[range] || range;
  };

  const getMonthName = (month: number) => {
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
    return months[month - 1];
  };

  const chips: Array<{ key: keyof FilterValues | 'search'; label: string }> = [];

  if (searchQuery) {
    chips.push({ key: 'search', label: `Search: "${searchQuery}"` });
  }

  if (filters.dateRange && filters.dateRange !== 'custom') {
    chips.push({ key: 'dateRange', label: getDateRangeLabel(filters.dateRange) });
  }

  if (filters.startDate || filters.endDate) {
    const label = `${filters.startDate || '...'} to ${filters.endDate || '...'}`;
    chips.push({ key: 'startDate', label });
  }

  if (filters.month && !filters.dateRange) {
    chips.push({
      key: 'month',
      label: `Month: ${getMonthName(filters.month)} ${filters.year || new Date().getFullYear()}`,
    });
  }

  if (filters.year && !filters.month && !filters.dateRange) {
    chips.push({ key: 'year', label: `Year: ${filters.year}` });
  }

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-sm font-medium text-muted-foreground self-center">
        Active filters:
      </span>
      {chips.map((chip) => (
        <Badge
          key={chip.key}
          variant="secondary"
          className="pl-3 pr-2 py-1 text-sm cursor-pointer hover:bg-secondary/80"
          onClick={() => onRemoveFilter(chip.key)}
        >
          {chip.label}
          <X className="ml-1 h-3 w-3" />
        </Badge>
      ))}
    </div>
  );
}
