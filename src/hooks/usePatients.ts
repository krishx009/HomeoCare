import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Types
export interface Patient {
  _id: string;
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  medicalHistory: string;
  doctorId: string;
  fileUrls: string[];
  createdAt: string;
  updatedAt: string;
}

interface CreatePatientInput {
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  medicalHistory?: string;
}

interface UpdatePatientInput {
  name?: string;
  age?: number;
  weight?: number;
  height?: number;
  medicalHistory?: string;
}

// API helper function to get auth token
async function getAuthToken(): Promise<string | null> {
  // Get the current user's ID token
  const auth = (await import('@/lib/firebase')).auth;
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

// API functions
async function fetchPatients(): Promise<Patient[]> {
  const token = await getAuthToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch('/api/patients', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch patients');
  }

  const data = await res.json();
  return data.data;
}

async function fetchPatient(id: string): Promise<Patient> {
  const token = await getAuthToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`/api/patients/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch patient');
  }

  const data = await res.json();
  return data.data;
}



async function createPatient(input: CreatePatientInput): Promise<Patient> {
  const token = await getAuthToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch('/api/patients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create patient');
  }

  const data = await res.json();
  return data.data;
}

async function updatePatient({
  id,
  ...input
}: UpdatePatientInput & { id: string }): Promise<Patient> {
  const token = await getAuthToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`/api/patients/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update patient');
  }

  const data = await res.json();
  return data.data;
}

async function deletePatient(id: string): Promise<void> {
  const token = await getAuthToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`/api/patients/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to delete patient');
  }
}

// Custom Hooks

/**
 * Hook to fetch all patients for the logged-in doctor
 */
export function usePatients() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients,
    enabled: !!user, // Only run query if user is authenticated
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single patient by ID
 */
export function usePatient(id: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['patients', id],
    queryFn: () => fetchPatient(id),
    enabled: !!user && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to create a new patient with optimistic updates
 */
export function useCreatePatient() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createPatient,
    onMutate: async (newPatient) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['patients'] });

      // Snapshot previous value
      const previousPatients = queryClient.getQueryData<Patient[]>(['patients']);

      // Optimistically update the cache
      queryClient.setQueryData<Patient[]>(['patients'], (old = []) => [
        {
          _id: 'temp-id',
          ...newPatient,
          medicalHistory: newPatient.medicalHistory || '',
          doctorId: '',
          fileUrls: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...old,
      ]);

      return { previousPatients };
    },
    onError: (err, newPatient, context) => {
      // Rollback on error
      if (context?.previousPatients) {
        queryClient.setQueryData(['patients'], context.previousPatients);
      }
    },
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patients', 'today'] });
      router.push('/patients');
    },
  });
}

/**
 * Hook to update a patient with optimistic updates
 */
export function useUpdatePatient() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: updatePatient,
    onMutate: async ({ id, ...updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['patients', id] });
      await queryClient.cancelQueries({ queryKey: ['patients'] });

      // Snapshot previous values
      const previousPatient = queryClient.getQueryData<Patient>(['patients', id]);
      const previousPatients = queryClient.getQueryData<Patient[]>(['patients']);

      // Optimistically update the patient
      queryClient.setQueryData<Patient>(['patients', id], (old) => {
        if (!old) return old;
        return { ...old, ...updates };
      });

      // Optimistically update the list
      queryClient.setQueryData<Patient[]>(['patients'], (old = []) =>
        old.map((patient) =>
          patient._id === id ? { ...patient, ...updates } : patient
        )
      );

      return { previousPatient, previousPatients };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousPatient) {
        queryClient.setQueryData(['patients', id], context.previousPatient);
      }
      if (context?.previousPatients) {
        queryClient.setQueryData(['patients'], context.previousPatients);
      }
    },
    onSuccess: (data, { id }) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['patients', id] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      router.push(`/patients/${id}`);
    },
  });
}

/**
 * Hook to get today's patients
 */
export function useTodaysPatients() {
  return useQuery({
    queryKey: ['patients', 'today'],
    queryFn: async () => {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const res = await fetch('/api/patients/today', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to fetch today\'s patients');
      }

      const data = await res.json();
      return data.patients as Patient[];
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Auto-refetch every 30 seconds
  });
}

/**
 * Hook to delete a patient
 */
export function useDeletePatient() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: deletePatient,
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['patients'] });

      // Snapshot previous value
      const previousPatients = queryClient.getQueryData<Patient[]>(['patients']);

      // Optimistically remove from cache
      queryClient.setQueryData<Patient[]>(['patients'], (old = []) =>
        old.filter((patient) => patient._id !== id)
      );

      return { previousPatients };
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousPatients) {
        queryClient.setQueryData(['patients'], context.previousPatients);
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patients', 'today'] });
      router.push('/patients');
    },
  });
}

/**
 * Hook to search and filter patients
 */
export interface SearchFilters {
  q?: string;
  dateRange?: string;
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  patients: Patient[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  query?: string;
}

async function searchPatients(filters: SearchFilters): Promise<SearchResult> {
  const token = await getAuthToken();
  if (!token) throw new Error('Not authenticated');

  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });

  const res = await fetch(`/api/patients/search?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to search patients');
  }

  const data = await res.json();
  return {
    patients: data.patients,
    pagination: data.pagination,
    query: data.query,
  };
}

export function usePatientSearch(filters: SearchFilters) {
  return useQuery({
    queryKey: ['patients', 'search', filters],
    queryFn: () => searchPatients(filters),
    staleTime: 30 * 1000, // 30 seconds
    enabled: true, // Always enabled, will show all patients if no filters
  });
}
