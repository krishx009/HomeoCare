'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePatients, useSearchPatients, useDeletePatient, Patient } from '@/hooks/usePatients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { PlusCircle, Search, Eye, Edit, Trash2, Loader2 } from 'lucide-react';

export default function PatientsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch patients or search results
  const { data: allPatients, isLoading: isLoadingAll } = usePatients();
  const { data: searchResults, isLoading: isSearching } = useSearchPatients(searchQuery);
  const deletePatient = useDeletePatient();

  // Determine which data to display
  const patients = searchQuery.length > 0 ? searchResults : allPatients;
  const isLoading = searchQuery.length > 0 ? isSearching : isLoadingAll;

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deletePatient.mutateAsync(deleteId);
      toast({
        title: 'Success',
        description: 'Patient deleted successfully',
      });
      setDeleteId(null);
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
    if (bmi === 'N/A') return 'N/A';
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return 'Underweight';
    if (bmiValue < 25) return 'Normal';
    if (bmiValue < 30) return 'Overweight';
    return 'Obese';
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-3xl font-bold">Patients</CardTitle>
              <CardDescription className="mt-2">
                Manage your patient records
              </CardDescription>
            </div>
            <Button
              onClick={() => router.push('/patients/new')}
              className="w-full sm:w-auto"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Patient
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading patients...</span>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && patients && patients.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchQuery.length > 0
                  ? 'No patients found matching your search.'
                  : 'No patients yet. Add your first patient to get started.'}
              </p>
              {searchQuery.length === 0 && (
                <Button onClick={() => router.push('/patients/new')}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Your First Patient
                </Button>
              )}
            </div>
          )}

          {/* Table */}
          {!isLoading && patients && patients.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Height (cm)</TableHead>
                    <TableHead>Weight (kg)</TableHead>
                    <TableHead>BMI</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => {
                    const bmi = calculateBMI(patient.weight, patient.height);
                    const bmiCategory = getBMICategory(bmi);
                    return (
                      <TableRow key={patient._id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>{patient.height}</TableCell>
                        <TableCell>{patient.weight}</TableCell>
                        <TableCell>
                          <span className="font-mono">{bmi}</span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              bmiCategory === 'Normal'
                                ? 'bg-green-100 text-green-700'
                                : bmiCategory === 'Underweight'
                                ? 'bg-yellow-100 text-yellow-700'
                                : bmiCategory === 'Overweight'
                                ? 'bg-orange-100 text-orange-700'
                                : bmiCategory === 'Obese'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {bmiCategory}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/patients/${patient._id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/patients/${patient._id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setDeleteId(patient._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Patient</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete <strong>{patient.name}</strong>?
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setDeleteId(null)}>
                                    Cancel
                                  </AlertDialogCancel>
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
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
