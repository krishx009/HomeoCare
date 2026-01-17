'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Eye, Stethoscope, Edit, Trash2, Loader2 } from 'lucide-react';
import { useDeletePatient } from '@/hooks/usePatients';
import { useToast } from '@/components/ui/use-toast';

interface Patient {
  _id: string;
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  medicalHistory?: string;
  createdAt: string;
  updatedAt: string;
}

interface PatientTableProps {
  patients: Patient[];
  isLoading?: boolean;
}

export default function PatientTable({ patients, isLoading }: PatientTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const deletePatient = useDeletePatient();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = async (patientId: string, patientName: string) => {
    try {
      await deletePatient.mutateAsync(patientId);
      toast({
        title: 'Success',
        description: `${patientName} deleted successfully`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete patient',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading patients...</span>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-gray-50">
        <p className="text-muted-foreground text-lg">No patients found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Height</TableHead>
            <TableHead>Registration Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow
              key={patient._id}
              className="cursor-pointer hover:bg-accent/50"
              onClick={() => router.push(`/patients/${patient._id}`)}
            >
              <TableCell className="font-medium">{patient.name}</TableCell>
              <TableCell>{patient.age ? `${patient.age} yrs` : '-'}</TableCell>
              <TableCell>{patient.weight ? `${patient.weight} kg` : '-'}</TableCell>
              <TableCell>{patient.height ? `${patient.height} cm` : '-'}</TableCell>
              <TableCell>{formatDate(patient.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/patients/${patient._id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => router.push(`/patients/${patient._id}/consultation/new`)}
                  >
                    <Stethoscope className="h-4 w-4 mr-1" />
                    Consult
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => router.push(`/patients/${patient._id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Patient</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete <strong>{patient.name}</strong>? This
                          action cannot be undone and will delete all consultations.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(patient._id, patient.name)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
