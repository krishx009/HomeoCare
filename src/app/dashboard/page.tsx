'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useTodaysPatients } from '@/hooks/usePatients';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import {
  User as UserIcon,
  Plus,
  Calendar,
  Eye,
  Stethoscope,
  Weight,
  Ruler,
  CalendarClock,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const { data: todaysPatients, isLoading } = useTodaysPatients();

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <AppLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Today's Patients</h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-2">
              <Calendar className="h-4 w-4" />
              Patients registered today - {formatDate()}
            </p>
          </div>
          <Button onClick={() => router.push('/patients/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Patient
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2 pt-4">
                      <Skeleton className="h-10 flex-1" />
                      <Skeleton className="h-10 flex-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && todaysPatients && todaysPatients.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-primary/10 p-6 mb-4">
                <CalendarClock className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No patients registered today</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-sm">
                Patients you add today will appear here. Start by adding your first patient
                of the day.
              </p>
              <Button onClick={() => router.push('/patients/new')} size="lg">
                <Plus className="mr-2 h-5 w-5" />
                New Patient
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Patient Cards Grid */}
        {!isLoading && todaysPatients && todaysPatients.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {todaysPatients.map((patient) => (
              <Card
                key={patient._id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Patient Name */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {patient.name}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarClock className="h-3 w-3 mr-1" />
                        Added at {formatTime(patient.createdAt)}
                      </div>
                    </div>

                    {/* Patient Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 py-3 border-y">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-medium">{patient.age} yrs</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Weight className="h-4 w-4 text-primary" />
                        <span className="font-medium">{patient.weight} kg</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Ruler className="h-4 w-4 text-primary" />
                        <span className="font-medium">{patient.height} cm</span>
                      </div>
                    </div>

                    {/* Medical History Preview */}
                    {patient.medicalHistory && (
                      <div className="text-sm text-muted-foreground">
                        <p className="line-clamp-2">{patient.medicalHistory}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.push(`/patients/${patient._id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() =>
                          router.push(`/patients/${patient._id}/consultation/new`)
                        }
                      >
                        <Stethoscope className="mr-2 h-4 w-4" />
                        Add Consultation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Patient Count Badge */}
        {!isLoading && todaysPatients && todaysPatients.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <UserIcon className="h-4 w-4" />
              {todaysPatients.length} {todaysPatients.length === 1 ? 'patient' : 'patients'}{' '}
              registered today
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}