'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePatient, useDeletePatient } from '@/hooks/usePatients';
import { useConsultations } from '@/hooks/useConsultations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Loader2, 
  User, 
  Calendar, 
  Ruler, 
  Weight, 
  FileText, 
  Plus, 
  ChevronDown, 
  ChevronUp,
  Stethoscope,
  Pill,
  Clock
} from 'lucide-react';

export default function ViewPatientPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const patientId = params.id as string;

  const { data: patientData, isLoading, error } = usePatient(patientId);
  const { data: consultations, isLoading: consultationsLoading } = useConsultations(patientId);
  const deletePatient = useDeletePatient();

  const [expandedConsultations, setExpandedConsultations] = useState<Record<string, boolean>>({});

  const toggleExpand = (consultationId: string) => {
    setExpandedConsultations(prev => ({
      ...prev,
      [consultationId]: !prev[consultationId],
    }));
  };

  const handleDelete = async () => {
    try {
      await deletePatient.mutateAsync(patientId);
      toast({
        title: 'Success',
        description: 'Patient deleted successfully',
      });
      router.push('/patients');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete patient',
        variant: 'destructive',
      });
    }
  };

  const calculateBMI = (weight: number, height: number) => {
    if (!weight || !height || height === 0) return 'N/A';
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi: string) => {
    if (bmi === 'N/A') return { label: 'N/A', color: 'gray' };
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { label: 'Underweight', color: 'yellow' };
    if (bmiValue < 25) return { label: 'Normal', color: 'green' };
    if (bmiValue < 30) return { label: 'Overweight', color: 'orange' };
    return { label: 'Obese', color: 'red' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

  if (error || !patientData) {
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

  const patient = patientData.patient;
  const bmi = calculateBMI(patient.weight, patient.height);
  const bmiCategory = getBMICategory(bmi);

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <CardTitle className="text-3xl font-bold flex items-center gap-2">
                <User className="h-8 w-8 text-primary" />
                {patient.name}
              </CardTitle>
              <CardDescription className="mt-2">
                Patient ID: {patient._id}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/patients/${patient._id}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Patient</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete <strong>{patient.name}</strong>? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {deletePatient.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        'Delete'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="info">Patient Info</TabsTrigger>
              <TabsTrigger value="consultations">
                Consultations
                {consultations && consultations.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {consultations.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Patient Info Tab */}
            <TabsContent value="info" className="space-y-6">
              {/* Basic Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age */}
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Age</p>
                    <p className="text-2xl font-bold">{patient.age} years</p>
                  </div>
                </div>

                {/* Height */}
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Ruler className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Height</p>
                    <p className="text-2xl font-bold">{patient.height} cm</p>
                  </div>
                </div>

                {/* Weight */}
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Weight className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Weight</p>
                    <p className="text-2xl font-bold">{patient.weight} kg</p>
                  </div>
                </div>

                {/* BMI */}
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <FileText className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">BMI</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold font-mono">{bmi}</p>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          bmiCategory.color === 'green'
                            ? 'bg-green-100 text-green-700'
                            : bmiCategory.color === 'yellow'
                            ? 'bg-yellow-100 text-yellow-700'
                            : bmiCategory.color === 'orange'
                            ? 'bg-orange-100 text-orange-700'
                            : bmiCategory.color === 'red'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {bmiCategory.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Medical History
                </h3>
                {patient.medicalHistory ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {patient.medicalHistory}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No medical history recorded
                  </p>
                )}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="text-sm">{formatDate(patient.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-sm">{formatDate(patient.updatedAt)}</p>
                </div>
              </div>
            </TabsContent>

            {/* Consultations Tab */}
            <TabsContent value="consultations" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Consultation History</h3>
                <Button onClick={() => router.push(`/patients/${patientId}/consultation/new`)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Consultation
                </Button>
              </div>

              {consultationsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading consultations...</span>
                </div>
              ) : consultations && consultations.length > 0 ? (
                <div className="space-y-4">
                  {consultations.map((consultation) => {
                    const isExpanded = expandedConsultations[consultation.consultationId];
                    const hasFollowup = !!consultation.followUpDate;
                    const followUpPast = hasFollowup && new Date(consultation.followUpDate!) < new Date();

                    return (
                      <Card key={consultation.consultationId} className="overflow-hidden">
                        <div
                          className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                          onClick={() => toggleExpand(consultation.consultationId)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {formatDate(consultation.consultationDate)}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {consultation.diagnosisApproach}
                                </Badge>
                                {hasFollowup && (
                                  <Badge 
                                    variant={followUpPast ? "destructive" : "secondary"}
                                    className="text-xs"
                                  >
                                    <Clock className="h-3 w-3 mr-1" />
                                    Follow-up: {new Date(consultation.followUpDate!).toLocaleDateString()}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-start gap-2 mb-2">
                                <Stethoscope className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {consultation.chiefComplaint}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Pill className="h-4 w-4 text-primary" />
                                <span className="font-semibold text-primary">
                                  {consultation.prescribedRemedy.remedyName} {consultation.prescribedRemedy.potency}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  • {consultation.prescribedRemedy.frequency} • {consultation.prescribedRemedy.duration}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2 items-start">
                              {hasFollowup && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/patients/${patientId}/consultation/${consultation.consultationId}/followup`);
                                  }}
                                >
                                  Add Follow-up
                                </Button>
                              )}
                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="border-t bg-accent/20 p-4 space-y-4">
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
                                {(consultation.physicalSymptoms.modalities.betterBy.length > 0 ||
                                  consultation.physicalSymptoms.modalities.worseBy.length > 0) && (
                                  <div className="mt-2 text-sm">
                                    {consultation.physicalSymptoms.modalities.betterBy.length > 0 && (
                                      <div>
                                        <span className="text-muted-foreground">Better by:</span>{' '}
                                        {consultation.physicalSymptoms.modalities.betterBy.join(', ')}
                                      </div>
                                    )}
                                    {consultation.physicalSymptoms.modalities.worseBy.length > 0 && (
                                      <div>
                                        <span className="text-muted-foreground">Worse by:</span>{' '}
                                        {consultation.physicalSymptoms.modalities.worseBy.join(', ')}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Mental/Emotional */}
                            {(consultation.mentalEmotionalState.primaryEmotion ||
                              consultation.mentalEmotionalState.personality) && (
                              <div>
                                <h4 className="font-semibold text-sm mb-2">Mental & Emotional State</h4>
                                <div className="text-sm space-y-1">
                                  {consultation.mentalEmotionalState.primaryEmotion && (
                                    <div>
                                      <span className="text-muted-foreground">Primary Emotion:</span>{' '}
                                      {consultation.mentalEmotionalState.primaryEmotion}
                                    </div>
                                  )}
                                  {consultation.mentalEmotionalState.personality && (
                                    <div>
                                      <span className="text-muted-foreground">Personality:</span>{' '}
                                      {consultation.mentalEmotionalState.personality}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* General Characteristics */}
                            {(consultation.generalCharacteristics.thermalState ||
                              consultation.generalCharacteristics.appetite) && (
                              <div>
                                <h4 className="font-semibold text-sm mb-2">General Characteristics</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  {consultation.generalCharacteristics.thermalState && (
                                    <div>
                                      <span className="text-muted-foreground">Thermal State:</span>{' '}
                                      {consultation.generalCharacteristics.thermalState}
                                    </div>
                                  )}
                                  {consultation.generalCharacteristics.appetite && (
                                    <div>
                                      <span className="text-muted-foreground">Appetite:</span>{' '}
                                      {consultation.generalCharacteristics.appetite}
                                    </div>
                                  )}
                                  {consultation.generalCharacteristics.thirst && (
                                    <div>
                                      <span className="text-muted-foreground">Thirst:</span>{' '}
                                      {consultation.generalCharacteristics.thirst}
                                    </div>
                                  )}
                                  {consultation.generalCharacteristics.energyLevel && (
                                    <div>
                                      <span className="text-muted-foreground">Energy:</span>{' '}
                                      {consultation.generalCharacteristics.energyLevel}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Remedy Details */}
                            <div className="bg-primary/5 p-3 rounded-lg">
                              <h4 className="font-semibold text-sm mb-2">Prescribed Remedy</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <Pill className="h-4 w-4" />
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
                                <div>
                                  <span className="text-muted-foreground">Reason:</span>{' '}
                                  {consultation.prescribedRemedy.reasonForSelection}
                                </div>
                              </div>
                            </div>

                            {/* Doctor Notes */}
                            {consultation.doctorNotes && (
                              <div>
                                <h4 className="font-semibold text-sm mb-2">Doctor's Notes</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                  {consultation.doctorNotes}
                                </p>
                              </div>
                            )}

                            {/* Follow-up & Next Steps */}
                            {(consultation.nextSteps || consultation.followUpDate) && (
                              <div className="border-t pt-3">
                                {consultation.nextSteps && (
                                  <div className="mb-2">
                                    <h4 className="font-semibold text-sm mb-1">Next Steps</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {consultation.nextSteps}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-12">
                  <div className="text-center">
                    <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Consultations Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by adding the first consultation for this patient
                    </p>
                    <Button onClick={() => router.push(`/patients/${patientId}/consultation/new`)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Consultation
                    </Button>
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
