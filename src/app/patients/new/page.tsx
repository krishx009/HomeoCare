'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreatePatient } from '@/hooks/usePatients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';

// Validation schema - ONLY NAME IS REQUIRED
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
    .max(150, 'Age must be less than 150')
    .optional()
    .or(z.literal(0)),
  weight: z
    .number({ invalid_type_error: 'Weight must be a number' })
    .positive('Weight must be positive')
    .max(500, 'Weight must be less than 500 kg')
    .optional()
    .or(z.literal(0)),
  height: z
    .number({ invalid_type_error: 'Height must be a number' })
    .positive('Height must be positive')
    .max(300, 'Height must be less than 300 cm')
    .optional()
    .or(z.literal(0)),
  medicalHistory: z
    .string()
    .max(5000, 'Medical history must be less than 5000 characters')
    .optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

export default function NewPatientPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createPatient = useCreatePatient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
  });

  const onSubmit = async (data: PatientFormData) => {
    try {
      // Clean up data - remove undefined/NaN values
      const cleanData: any = { name: data.name };
      if (data.age && !isNaN(data.age) && data.age > 0) cleanData.age = data.age;
      if (data.weight && !isNaN(data.weight) && data.weight > 0) cleanData.weight = data.weight;
      if (data.height && !isNaN(data.height) && data.height > 0) cleanData.height = data.height;
      if (data.medicalHistory) cleanData.medicalHistory = data.medicalHistory;

      await createPatient.mutateAsync(cleanData);
      toast({
        title: 'Success',
        description: 'Patient created successfully',
      });
      // Navigation is handled by the hook
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create patient',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Add New Patient</CardTitle>
          <CardDescription>
            Enter patient details to create a new record
          </CardDescription>
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
              <Label htmlFor="age">Age (Optional)</Label>
              <Input
                id="age"
                type="number"
                {...register('age', { valueAsNumber: true })}
                placeholder="Optional - Enter age in years"
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
                <Label htmlFor="height">Height (cm) - Optional</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  {...register('height', { valueAsNumber: true })}
                  placeholder="Optional - e.g., 170"
                  aria-invalid={!!errors.height}
                />
                {errors.height && (
                  <p className="text-sm text-red-500">{errors.height.message}</p>
                )}
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg) - Optional</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  {...register('weight', { valueAsNumber: true })}
                  placeholder="Optional - e.g., 70"
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
                disabled={isSubmitting || createPatient.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting || createPatient.isPending}
              >
                {isSubmitting || createPatient.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Patient'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
