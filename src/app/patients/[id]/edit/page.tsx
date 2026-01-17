'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePatient, useUpdatePatient } from '@/hooks/usePatients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';

// Validation schema
const patientSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  age: z
    .number({ invalid_type_error: 'Age must be a number' })
    .int('Age must be a whole number')
    .min(0, 'Age must be at least 0')
    .max(150, 'Age must be less than 150'),
  weight: z
    .number({ invalid_type_error: 'Weight must be a number' })
    .positive('Weight must be positive')
    .max(500, 'Weight must be less than 500 kg'),
  height: z
    .number({ invalid_type_error: 'Height must be a number' })
    .positive('Height must be positive')
    .max(300, 'Height must be less than 300 cm'),
  medicalHistory: z
    .string()
    .max(5000, 'Medical history must be less than 5000 characters')
    .optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

export default function EditPatientPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const patientId = params.id as string;

  const { data: patient, isLoading, error } = usePatient(patientId);
  const updatePatient = useUpdatePatient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    values: patient
      ? {
          name: patient.name,
          age: patient.age,
          weight: patient.weight,
          height: patient.height,
          medicalHistory: patient.medicalHistory || '',
        }
      : undefined,
  });

  const onSubmit = async (data: PatientFormData) => {
    try {
      await updatePatient.mutateAsync({
        id: patientId,
        ...data,
      });
      toast({
        title: 'Success',
        description: 'Patient updated successfully',
      });
      // Navigation is handled by the hook
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update patient',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading patient details...</span>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-500 mb-4">Patient not found</p>
            <Button onClick={() => router.push('/patients')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Patients
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Edit Patient</CardTitle>
          <CardDescription>Update patient information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Patient Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter patient's full name"
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age">
                Age <span className="text-red-500">*</span>
              </Label>
              <Input
                id="age"
                type="number"
                {...register('age', { valueAsNumber: true })}
                placeholder="Enter age in years"
                aria-invalid={!!errors.age}
              />
              {errors.age && (
                <p className="text-sm text-red-500">{errors.age.message}</p>
              )}
            </div>

            {/* Height and Weight Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Height */}
              <div className="space-y-2">
                <Label htmlFor="height">
                  Height (cm) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  {...register('height', { valueAsNumber: true })}
                  placeholder="e.g., 170"
                  aria-invalid={!!errors.height}
                />
                {errors.height && (
                  <p className="text-sm text-red-500">{errors.height.message}</p>
                )}
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label htmlFor="weight">
                  Weight (kg) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  {...register('weight', { valueAsNumber: true })}
                  placeholder="e.g., 70"
                  aria-invalid={!!errors.weight}
                />
                {errors.weight && (
                  <p className="text-sm text-red-500">{errors.weight.message}</p>
                )}
              </div>
            </div>

            {/* Medical History */}
            <div className="space-y-2">
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea
                id="medicalHistory"
                {...register('medicalHistory')}
                placeholder="Enter any relevant medical history, allergies, medications, etc."
                rows={6}
                aria-invalid={!!errors.medicalHistory}
              />
              {errors.medicalHistory && (
                <p className="text-sm text-red-500">
                  {errors.medicalHistory.message}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Optional: Include allergies, chronic conditions, current medications, etc.
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
                disabled={isSubmitting || updatePatient.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting || updatePatient.isPending}
              >
                {isSubmitting || updatePatient.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
