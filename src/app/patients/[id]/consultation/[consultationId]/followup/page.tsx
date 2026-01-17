'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useConsultation, useAddFollowup } from '@/hooks/useConsultations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, Save, ChevronDown, ChevronUp, Pill, Calendar } from 'lucide-react';
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
  PrescribedRemedy,
} from '@/types/consultation';

const followupSchema = z.object({
  responseToTreatment: z.enum(['improved', 'same', 'worsened', 'partially_improved']),
  improvementsNoted: z.string().optional(),
  remainingSymptoms: z.string().optional(),
  newSymptoms: z.string().optional(),
  followUpNotes: z.string().optional(),
  decision: z.enum(['repeat', 'change', 'observe']),
  nextFollowUpDate: z.string().optional(),
  // Fields for new prescription (if changing remedy)
  remedyName: z.string().optional(),
  potency: z.string().optional(),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  duration: z.string().optional(),
  instructions: z.string().optional(),
  reasonForSelection: z.string().optional(),
});

type FollowupFormData = z.infer<typeof followupSchema>;

export default function FollowupPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const patientId = params.id as string;
  const consultationId = params.consultationId as string;

  const { data, isLoading: isLoadingConsultation } = useConsultation(consultationId);
  const addFollowup = useAddFollowup(consultationId);

  const [isPreviousExpanded, setIsPreviousExpanded] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FollowupFormData>({
    resolver: zodResolver(followupSchema),
    defaultValues: {
      responseToTreatment: 'improved',
      decision: 'repeat',
      frequency: 'Single dose',
      potency: '30C',
      dosage: '2 pills',
    },
  });

  const decision = watch('decision');

  const onSubmit = async (formData: FollowupFormData) => {
    try {
      let newPrescription: PrescribedRemedy | undefined;

      if (formData.decision === 'change' && formData.remedyName) {
        newPrescription = {
          remedyName: formData.remedyName,
          potency: formData.potency!,
          dosage: formData.dosage!,
          frequency: formData.frequency!,
          duration: formData.duration!,
          instructions: formData.instructions || '',
          reasonForSelection: formData.reasonForSelection || '',
        };
      }

      await addFollowup.mutateAsync({
        responseToTreatment: formData.responseToTreatment,
        improvementsNoted: formData.improvementsNoted || '',
        remainingSymptoms: formData.remainingSymptoms || '',
        newSymptoms: formData.newSymptoms || '',
        followUpNotes: formData.followUpNotes || '',
        decision: formData.decision,
        nextFollowUpDate: formData.nextFollowUpDate || undefined,
        newPrescription,
      });

      toast({
        title: 'Success',
        description: 'Follow-up added successfully',
      });

      router.push(`/patients/${patientId}`);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to add follow-up',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoadingConsultation) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </ProtectedRoute>
    );
  }

  if (!data) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto py-8 px-4">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-red-500 mb-4">Consultation not found</p>
              <Button onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  const { consultation, patient } = data;

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
            <h1 className="text-3xl font-bold">Follow-up Consultation</h1>
            <p className="text-muted-foreground mt-2">
              Patient: {patient.name} | Age: {patient.age}
            </p>
          </div>

          {/* Section 1: Previous Consultation Summary */}
          <Card className="mb-6">
            <CardHeader
              className="cursor-pointer"
              onClick={() => setIsPreviousExpanded(!isPreviousExpanded)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Previous Consultation - {formatDate(consultation.consultationDate.toString())}
                </CardTitle>
                {isPreviousExpanded ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </CardHeader>
            {isPreviousExpanded && (
              <CardContent className="space-y-4">
                {/* Chief Complaint */}
                <div>
                  <h4 className="font-semibold text-sm mb-1">Chief Complaint</h4>
                  <p className="text-sm text-muted-foreground">{consultation.chiefComplaint}</p>
                </div>

                {/* Physical Symptoms */}
                {consultation.physicalSymptoms.location && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Physical Symptoms</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {consultation.physicalSymptoms.location && (
                        <div>
                          <span className="text-muted-foreground">Location:</span>{' '}
                          {consultation.physicalSymptoms.location}
                        </div>
                      )}
                      {consultation.physicalSymptoms.sensation && (
                        <div>
                          <span className="text-muted-foreground">Sensation:</span>{' '}
                          {consultation.physicalSymptoms.sensation}
                        </div>
                      )}
                      {consultation.physicalSymptoms.timing && (
                        <div>
                          <span className="text-muted-foreground">Timing:</span>{' '}
                          {consultation.physicalSymptoms.timing}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Prescribed Remedy */}
                <div className="bg-primary/5 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Pill className="h-4 w-4" />
                    Prescribed Remedy
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {consultation.prescribedRemedy.remedyName} {consultation.prescribedRemedy.potency}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-muted-foreground">Dosage:</span>{' '}
                        {consultation.prescribedRemedy.dosage}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Frequency:</span>{' '}
                        {consultation.prescribedRemedy.frequency}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration:</span>{' '}
                        {consultation.prescribedRemedy.duration}
                      </div>
                    </div>
                    {consultation.prescribedRemedy.instructions && (
                      <div>
                        <span className="text-muted-foreground">Instructions:</span>{' '}
                        {consultation.prescribedRemedy.instructions}
                      </div>
                    )}
                  </div>
                </div>

                {/* Diagnosis Approach */}
                <div>
                  <span className="text-sm text-muted-foreground">Approach:</span>{' '}
                  <span className="text-sm capitalize">{consultation.diagnosisApproach}</span>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Section 2: Follow-up Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Follow-up Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Response to Treatment */}
                <div>
                  <Label>Response to Treatment *</Label>
                  <Controller
                    name="responseToTreatment"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="improved" id="improved" />
                          <Label htmlFor="improved" className="font-normal cursor-pointer">
                            Improved - Symptoms have significantly reduced
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="partially_improved" id="partially_improved" />
                          <Label htmlFor="partially_improved" className="font-normal cursor-pointer">
                            Partially Improved - Some improvement but symptoms persist
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="same" id="same" />
                          <Label htmlFor="same" className="font-normal cursor-pointer">
                            No Change - Symptoms remain the same
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="worsened" id="worsened" />
                          <Label htmlFor="worsened" className="font-normal cursor-pointer">
                            Worsened - Symptoms have increased or new issues appeared
                          </Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {errors.responseToTreatment && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.responseToTreatment.message}
                    </p>
                  )}
                </div>

                {/* Improvements Noted */}
                <div>
                  <Label htmlFor="improvementsNoted">Improvements Noted</Label>
                  <Textarea
                    id="improvementsNoted"
                    {...register('improvementsNoted')}
                    placeholder="What specific improvements has the patient experienced?"
                    rows={3}
                    className="mt-1"
                  />
                </div>

                {/* Remaining Symptoms */}
                <div>
                  <Label htmlFor="remainingSymptoms">Remaining Symptoms</Label>
                  <Textarea
                    id="remainingSymptoms"
                    {...register('remainingSymptoms')}
                    placeholder="What symptoms are still present?"
                    rows={3}
                    className="mt-1"
                  />
                </div>

                {/* New Symptoms */}
                <div>
                  <Label htmlFor="newSymptoms">New Symptoms (if any)</Label>
                  <Textarea
                    id="newSymptoms"
                    {...register('newSymptoms')}
                    placeholder="Any new symptoms that appeared after treatment?"
                    rows={3}
                    className="mt-1"
                  />
                </div>

                {/* Follow-up Notes */}
                <div>
                  <Label htmlFor="followUpNotes">Additional Notes</Label>
                  <Textarea
                    id="followUpNotes"
                    {...register('followUpNotes')}
                    placeholder="Any additional observations or notes..."
                    rows={3}
                    className="mt-1"
                  />
                </div>

                {/* Treatment Decision */}
                <div className="border-t pt-6">
                  <Label>Treatment Decision *</Label>
                  <Controller
                    name="decision"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="repeat" id="repeat" />
                          <Label htmlFor="repeat" className="font-normal cursor-pointer">
                            Repeat - Same remedy working well
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="change" id="change" />
                          <Label htmlFor="change" className="font-normal cursor-pointer">
                            Change Remedy - Need different approach
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="observe" id="observe" />
                          <Label htmlFor="observe" className="font-normal cursor-pointer">
                            Observe - Wait and monitor patient
                          </Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {errors.decision && (
                    <p className="text-sm text-destructive mt-1">{errors.decision.message}</p>
                  )}
                </div>

                {/* New Prescription (Conditional) */}
                {decision === 'change' && (
                  <div className="border border-primary/20 rounded-lg p-4 space-y-4 bg-primary/5">
                    <h3 className="font-semibold">New Remedy Prescription</h3>

                    <div>
                      <Label htmlFor="remedyName">New Remedy *</Label>
                      <Controller
                        name="remedyName"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select new remedy" />
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
                      </div>

                      <div>
                        <Label htmlFor="dosage">Dosage *</Label>
                        <Input
                          id="dosage"
                          {...register('dosage')}
                          placeholder="e.g., 2 pills"
                          className="mt-1"
                        />
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
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="duration">Duration *</Label>
                      <Input
                        id="duration"
                        {...register('duration')}
                        placeholder="e.g., Observe for 3 weeks"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="instructions">Special Instructions</Label>
                      <Textarea
                        id="instructions"
                        {...register('instructions')}
                        placeholder="e.g., Avoid coffee, take on empty stomach..."
                        rows={2}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="reasonForSelection">Reason for Change *</Label>
                      <Textarea
                        id="reasonForSelection"
                        {...register('reasonForSelection')}
                        placeholder="Why changing to this remedy? What indicates this remedy now?"
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                {/* Next Follow-up Date */}
                {decision !== 'observe' && (
                  <div>
                    <Label htmlFor="nextFollowUpDate">
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Next Follow-up Date
                    </Label>
                    <Input
                      id="nextFollowUpDate"
                      type="date"
                      {...register('nextFollowUpDate')}
                      className="mt-1"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: 2-4 weeks from today
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Follow-up
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
