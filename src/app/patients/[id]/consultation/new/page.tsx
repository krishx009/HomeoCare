'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { usePatient } from '@/hooks/usePatients';
import { useCreateConsultation } from '@/hooks/useConsultations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, ArrowRight, Save } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  COMMON_REMEDIES,
  POTENCIES,
  SENSATIONS,
  TIMINGS,
  CreateConsultationData,
} from '@/types/consultation';

const consultationSchema = z.object({
  chiefComplaint: z.string().min(10, 'Chief complaint must be at least 10 characters'),
  physicalLocation: z.string().optional(),
  physicalSensation: z.string().optional(),
  physicalTiming: z.string().optional(),
  betterBy: z.string().optional(),
  worseBy: z.string().optional(),
  primaryEmotion: z.string().optional(),
  personality: z.string().optional(),
  stressResponse: z.string().optional(),
  thermalState: z.string().optional(),
  appetite: z.string().optional(),
  thirst: z.string().optional(),
  foodCravings: z.string().optional(),
  sleepPattern: z.string().optional(),
  energyLevel: z.string().optional(),
  remedyName: z.string().min(2, 'Remedy name is required'),
  potency: z.string().min(1, 'Potency is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  duration: z.string().min(1, 'Duration is required'),
  instructions: z.string().optional(),
  reasonForSelection: z.string().optional(), // MADE OPTIONAL
  doctorNotes: z.string().optional(),
  diagnosisApproach: z.enum(['constitutional', 'acute', 'chronic', 'miasmatic']),
  followUpDate: z.string().optional(),
  nextSteps: z.string().optional(),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

export default function NewConsultationPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const patientId = params.id as string;

  const { data: patientData, isLoading: isLoadingPatient } = usePatient(patientId);
  const createConsultation = useCreateConsultation(patientId);

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      diagnosisApproach: 'constitutional',
      potency: '30C',
      frequency: 'Single dose',
      dosage: '2 pills',
    },
  });

  const onSubmit = async (data: ConsultationFormData) => {
    try {
      const consultationData: CreateConsultationData = {
        chiefComplaint: data.chiefComplaint,
        physicalSymptoms: {
          location: data.physicalLocation || '',
          sensation: data.physicalSensation || '',
          timing: data.physicalTiming || '',
          modalities: {
            betterBy: data.betterBy?.split(',').map(s => s.trim()).filter(Boolean) || [],
            worseBy: data.worseBy?.split(',').map(s => s.trim()).filter(Boolean) || [],
          },
        },
        mentalEmotionalState: {
          primaryEmotion: data.primaryEmotion || '',
          personality: data.personality || '',
          stressResponse: data.stressResponse || '',
        },
        generalCharacteristics: {
          thermalState: data.thermalState || '',
          appetite: data.appetite || '',
          thirst: data.thirst || '',
          foodCravings: data.foodCravings?.split(',').map(s => s.trim()).filter(Boolean) || [],
          sleepPattern: data.sleepPattern || '',
          energyLevel: data.energyLevel || '',
        },
        prescribedRemedy: {
          remedyName: data.remedyName,
          potency: data.potency,
          dosage: data.dosage,
          frequency: data.frequency,
          duration: data.duration,
          instructions: data.instructions || '',
          reasonForSelection: data.reasonForSelection,
        },
        doctorNotes: data.doctorNotes || '',
        diagnosisApproach: data.diagnosisApproach,
        followUpDate: data.followUpDate || null,
        nextSteps: data.nextSteps || '',
      };

      await createConsultation.mutateAsync(consultationData);

      toast({
        title: 'Success',
        description: 'Consultation added successfully',
      });

      router.push(`/patients/${patientId}`);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to add consultation',
      });
    }
  };

  if (isLoadingPatient) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </ProtectedRoute>
    );
  }

  const patient = patientData;

  const stepTitles = [
    'Chief Complaint & Physical',
    'Mental & Emotional',
    'General Characteristics',
    'Remedy Prescription',
    'Clinical Notes',
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">New Consultation</h1>
            <p className="text-muted-foreground mt-2">
              Patient: {patient?.name} | Age: {patient?.age}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded ${
                    step <= currentStep ? 'bg-primary' : 'bg-gray-200'
                  } ${step !== 5 ? 'mr-2' : ''}`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
              {stepTitles.map((title, idx) => (
                <span key={idx} className="text-center flex-1">
                  {title}
                </span>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Chief Complaint & Physical Symptoms */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Chief Complaint & Physical Symptoms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="chiefComplaint">Chief Complaint *</Label>
                    <Textarea
                      id="chiefComplaint"
                      {...register('chiefComplaint')}
                      placeholder="Describe the main complaint in detail..."
                      rows={4}
                      className="mt-1"
                    />
                    {errors.chiefComplaint && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.chiefComplaint.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="physicalLocation">Location</Label>
                      <Input
                        id="physicalLocation"
                        {...register('physicalLocation')}
                        placeholder="e.g., Head, Abdomen, Right knee"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="physicalSensation">Sensation</Label>
                      <Controller
                        name="physicalSensation"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select sensation" />
                            </SelectTrigger>
                            <SelectContent>
                              {SENSATIONS.map((sensation) => (
                                <SelectItem key={sensation} value={sensation}>
                                  {sensation.charAt(0).toUpperCase() + sensation.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="physicalTiming">Timing</Label>
                    <Controller
                      name="physicalTiming"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select timing" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIMINGS.map((timing) => (
                              <SelectItem key={timing} value={timing}>
                                {timing.charAt(0).toUpperCase() + timing.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="betterBy">Better By (comma-separated)</Label>
                      <Input
                        id="betterBy"
                        {...register('betterBy')}
                        placeholder="e.g., Warmth, Rest, Pressure"
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        What makes symptoms better?
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="worseBy">Worse By (comma-separated)</Label>
                      <Input
                        id="worseBy"
                        {...register('worseBy')}
                        placeholder="e.g., Cold, Motion, Night"
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        What makes symptoms worse?
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Mental & Emotional */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Mental & Emotional State</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="primaryEmotion">Primary Emotion</Label>
                    <Controller
                      name="primaryEmotion"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select primary emotion" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="anxiety">Anxiety</SelectItem>
                            <SelectItem value="fear">Fear</SelectItem>
                            <SelectItem value="anger">Anger</SelectItem>
                            <SelectItem value="sadness">Sadness</SelectItem>
                            <SelectItem value="grief">Grief</SelectItem>
                            <SelectItem value="irritability">Irritability</SelectItem>
                            <SelectItem value="depression">Depression</SelectItem>
                            <SelectItem value="apathy">Apathy</SelectItem>
                            <SelectItem value="calm">Calm</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="personality">Personality Traits</Label>
                    <Textarea
                      id="personality"
                      {...register('personality')}
                      placeholder="Describe personality characteristics, behavioral patterns..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stressResponse">Response to Stress</Label>
                    <Textarea
                      id="stressResponse"
                      {...register('stressResponse')}
                      placeholder="How does patient respond to stressful situations?"
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: General Characteristics */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>General Characteristics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Thermal State</Label>
                    <Controller
                      name="thermalState"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-2 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="chilly" id="chilly" />
                            <Label htmlFor="chilly" className="font-normal cursor-pointer">
                              Chilly Patient (feels cold easily)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="hot" id="hot" />
                            <Label htmlFor="hot" className="font-normal cursor-pointer">
                              Hot Patient (feels warm/hot)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="normal" id="normal-thermal" />
                            <Label htmlFor="normal-thermal" className="font-normal cursor-pointer">
                              Normal
                            </Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="appetite">Appetite</Label>
                      <Controller
                        name="appetite"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select appetite" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="increased">Increased</SelectItem>
                              <SelectItem value="decreased">Decreased</SelectItem>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="variable">Variable</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div>
                      <Label htmlFor="thirst">Thirst</Label>
                      <Controller
                        name="thirst"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select thirst level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="thirstless">Thirstless</SelectItem>
                              <SelectItem value="small sips">Small sips</SelectItem>
                              <SelectItem value="large quantities">Large quantities</SelectItem>
                              <SelectItem value="warm drinks">Warm drinks</SelectItem>
                              <SelectItem value="cold drinks">Cold drinks</SelectItem>
                              <SelectItem value="normal">Normal</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="energyLevel">Energy Level</Label>
                    <Controller
                      name="energyLevel"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select energy level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="variable">Variable</SelectItem>
                            <SelectItem value="exhausted">Exhausted</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="foodCravings">Food Cravings (comma-separated)</Label>
                    <Input
                      id="foodCravings"
                      {...register('foodCravings')}
                      placeholder="e.g., Salt, Sweets, Sour foods, Spicy"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sleepPattern">Sleep Pattern</Label>
                    <Textarea
                      id="sleepPattern"
                      {...register('sleepPattern')}
                      placeholder="Describe sleep quality, timing, disturbances, dreams..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Remedy Prescription */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Remedy Prescription</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="remedyName">Remedy Name *</Label>
                    <Controller
                      name="remedyName"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select remedy" />
                          </SelectTrigger>
                          <SelectContent>
                            {COMMON_REMEDIES.map((remedy) => (
                              <SelectItem key={remedy} value={remedy}>
                                {remedy}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.remedyName && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.remedyName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="potency">Potency *</Label>
                      <Controller
                        name="potency"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {POTENCIES.map((potency) => (
                                <SelectItem key={potency} value={potency}>
                                  {potency}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.potency && (
                        <p className="text-sm text-destructive mt-1">{errors.potency.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="dosage">Dosage *</Label>
                      <Input
                        id="dosage"
                        {...register('dosage')}
                        placeholder="e.g., 2 pills, 5 drops"
                        className="mt-1"
                      />
                      {errors.dosage && (
                        <p className="text-sm text-destructive mt-1">{errors.dosage.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="frequency">Frequency *</Label>
                      <Controller
                        name="frequency"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Single dose">Single dose</SelectItem>
                              <SelectItem value="Once daily">Once daily</SelectItem>
                              <SelectItem value="Twice daily">Twice daily</SelectItem>
                              <SelectItem value="Thrice daily">Thrice daily</SelectItem>
                              <SelectItem value="SOS">SOS (as needed)</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.frequency && (
                        <p className="text-sm text-destructive mt-1">{errors.frequency.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration / Observation Period *</Label>
                    <Input
                      id="duration"
                      {...register('duration')}
                      placeholder="e.g., Observe for 3 weeks, 1 month, 15 days"
                      className="mt-1"
                    />
                    {errors.duration && (
                      <p className="text-sm text-destructive mt-1">{errors.duration.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="instructions">Special Instructions</Label>
                    <Textarea
                      id="instructions"
                      {...register('instructions')}
                      placeholder="e.g., Avoid coffee, camphor. Take on empty stomach 30 min before meals. Do not touch pills with hands."
                      rows={3}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Common instructions: Avoid coffee, camphor, menthol, strong perfumes
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="reasonForSelection">Reason for Remedy Selection (Optional)</Label>
                    <Textarea
                      id="reasonForSelection"
                      {...register('reasonForSelection')}
                      placeholder="Optional - Document why this remedy matches the patient's symptoms (symptom similarity, constitutional match, etc.)..."
                      rows={4}
                      className="mt-1"
                    />
                    {errors.reasonForSelection && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.reasonForSelection.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Clinical Notes */}
            {currentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle>Clinical Notes & Follow-up</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="doctorNotes">Doctor's Private Notes</Label>
                    <Textarea
                      id="doctorNotes"
                      {...register('doctorNotes')}
                      placeholder="Private notes for your reference (not shared with patient)..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Diagnosis Approach *</Label>
                    <Controller
                      name="diagnosisApproach"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-2 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="constitutional" id="constitutional" />
                            <Label htmlFor="constitutional" className="font-normal cursor-pointer">
                              Constitutional (treats whole person, long-term)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="acute" id="acute" />
                            <Label htmlFor="acute" className="font-normal cursor-pointer">
                              Acute (treats sudden illness, short-term)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="chronic" id="chronic" />
                            <Label htmlFor="chronic" className="font-normal cursor-pointer">
                              Chronic (treats ongoing condition)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="miasmatic" id="miasmatic" />
                            <Label htmlFor="miasmatic" className="font-normal cursor-pointer">
                              Miasmatic (treats underlying miasm)
                            </Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="followUpDate">Follow-up Date</Label>
                    <Input
                      id="followUpDate"
                      type="date"
                      {...register('followUpDate')}
                      className="mt-1"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: 2-4 weeks from today
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="nextSteps">Next Steps / Instructions for Patient</Label>
                    <Textarea
                      id="nextSteps"
                      {...register('nextSteps')}
                      placeholder="Instructions or advice for the patient..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1 || isSubmitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                  disabled={isSubmitting}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Consultation
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
