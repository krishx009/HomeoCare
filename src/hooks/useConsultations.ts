import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { auth } from '@/lib/firebase';
import { Consultation, CreateConsultationData, FollowUpData, PatientWithFollowup } from '@/types/consultation';

// Get all consultations for a patient
export function useConsultations(patientId: string) {
  return useQuery({
    queryKey: ['consultations', patientId],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`/api/patients/${patientId}/consultations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch consultations');
      }

      return response.json() as Promise<{ consultations: Consultation[] }>;
    },
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get single consultation
export function useConsultation(consultationId: string) {
  return useQuery({
    queryKey: ['consultation', consultationId],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`/api/consultations/${consultationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch consultation');
      }

      return response.json() as Promise<{
        consultation: Consultation;
        patient: { _id: string; name: string; age: number };
      }>;
    },
    enabled: !!consultationId,
    staleTime: 5 * 60 * 1000,
  });
}

// Create consultation
export function useCreateConsultation(patientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (consultationData: CreateConsultationData) => {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`/api/patients/${patientId}/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(consultationData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create consultation');
      }

      return response.json() as Promise<{
        message: string;
        consultation: Consultation;
      }>;
    },
    onMutate: async (newConsultation) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['consultations', patientId] });
      await queryClient.cancelQueries({ queryKey: ['patients', patientId] });

      // Snapshot previous values
      const previousConsultations = queryClient.getQueryData(['consultations', patientId]);
      const previousPatient = queryClient.getQueryData(['patients', patientId]);

      // Optimistically update consultations list
      queryClient.setQueryData(['consultations', patientId], (old: any) => {
        const optimisticConsultation: any = {
          consultationId: `temp-${Date.now()}`,
          consultationDate: new Date(),
          ...newConsultation,
          doctorNotes: newConsultation.doctorNotes || '',
        };
        return {
          consultations: [optimisticConsultation, ...(old?.consultations || [])],
        };
      });

      return { previousConsultations, previousPatient };
    },
    onError: (err, newConsultation, context) => {
      // Rollback on error
      if (context?.previousConsultations) {
        queryClient.setQueryData(['consultations', patientId], context.previousConsultations);
      }
      if (context?.previousPatient) {
        queryClient.setQueryData(['patients', patientId], context.previousPatient);
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['consultations', patientId] });
      queryClient.invalidateQueries({ queryKey: ['patients', patientId] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['followups-due'] });
    },
  });
}

// Add follow-up to consultation
export function useAddFollowup(consultationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (followupData: FollowUpData) => {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`/api/consultations/${consultationId}/followup`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(followupData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add follow-up');
      }

      return response.json() as Promise<{
        message: string;
        consultation: Consultation;
      }>;
    },
    onMutate: async (followupData) => {
      await queryClient.cancelQueries({ queryKey: ['consultation', consultationId] });

      const previousConsultation = queryClient.getQueryData(['consultation', consultationId]);

      // Optimistically update consultation
      queryClient.setQueryData(['consultation', consultationId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          consultation: {
            ...old.consultation,
            ...followupData,
          },
        };
      });

      return { previousConsultation };
    },
    onError: (err, followupData, context) => {
      if (context?.previousConsultation) {
        queryClient.setQueryData(['consultation', consultationId], context.previousConsultation);
      }
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: ['consultation', consultationId] });
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['followups-due'] });

      // If we got patient ID from response, invalidate that too
      if (data?.consultation) {
        const consultationData = queryClient.getQueryData<any>(['consultation', consultationId]);
        if (consultationData?.patient?._id) {
          queryClient.invalidateQueries({ queryKey: ['patients', consultationData.patient._id] });
        }
      }
    },
  });
}

// Get patients with follow-ups due
export function useFollowupsDue() {
  return useQuery({
    queryKey: ['followups-due'],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch('/api/patients/followups-due', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch follow-ups');
      }

      return response.json() as Promise<{ patients: PatientWithFollowup[] }>;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

// Get consultation statistics
export function useConsultationStats() {
  return useQuery({
    queryKey: ['consultation-stats'],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch('/api/consultations/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        // If endpoint doesn't exist yet, return default values
        if (response.status === 404) {
          return {
            totalThisMonth: 0,
            followupsDueThisWeek: 0,
            consultedToday: 0,
            activeRemedies: 0,
          };
        }
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch stats');
      }

      return response.json() as Promise<{
        totalThisMonth: number;
        followupsDueThisWeek: number;
        consultedToday: number;
        activeRemedies: number;
      }>;
    },
    staleTime: 5 * 60 * 1000,
  });
}
