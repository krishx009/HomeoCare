'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLogout } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { usePatients } from '@/hooks/usePatients';
import { useConsultationStats, useFollowupsDue } from '@/hooks/useConsultations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  LogOut,
  User as UserIcon,
  Plus,
  Users,
  Loader2,
  CalendarClock,
  Pill,
  Calendar,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const logoutMutation = useLogout();

  const { data: patientsData, isLoading: patientsLoading } = usePatients();
  const { data: stats, isLoading: statsLoading } = useConsultationStats();
  const { data: followupsDue, isLoading: followupsLoading } = useFollowupsDue();

  const [patientFilter, setPatientFilter] = useState<'all' | 'followups' | 'recent' | 'none'>('all');

  const handleLogout = async () => {
    const result = await logoutMutation.mutateAsync();
    if (result.success) {
      toast({
        title: 'Success',
        description: 'Logged out successfully',
      });
      router.push('/auth/signin');
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'DR';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysUntilText = (days: number) => {
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  };

  // Filter patients based on selected tab
  const filteredPatients = patientsData?.patients ? patientsData.patients.filter(patient => {
    if (patientFilter === 'all') return true;
    if (patientFilter === 'followups') {
      return followupsDue?.some(f => f._id === patient._id);
    }
    if (patientFilter === 'recent') {
      const lastConsultDate = patient.lastConsultationDate ? new Date(patient.lastConsultationDate) : null;
      if (!lastConsultDate) return false;
      const daysSince = Math.floor((Date.now() - lastConsultDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysSince <= 7;
    }
    if (patientFilter === 'none') {
      return patient.totalConsultations === 0;
    }
    return true;
  }) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">
                HomeoCare
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.photoURL || ''}
                        alt={user?.displayName || ''}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user?.displayName || null)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.displayName || 'Doctor'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 space-y-6">
          {/* Consultation Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Consultations This Month */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats?.totalThisMonth || 0}</div>
                    <p className="text-xs text-muted-foreground">Consultations</p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Follow-ups Due This Week */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Follow-ups Due</CardTitle>
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats?.followupsDueThisWeek || 0}</div>
                    <p className="text-xs text-muted-foreground">This week</p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Consulted Today */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats?.consultedToday || 0}</div>
                    <p className="text-xs text-muted-foreground">Patients seen</p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Active Remedies */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Remedies</CardTitle>
                <Pill className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats?.activeRemedies || 0}</div>
                    <p className="text-xs text-muted-foreground">Unique remedies</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Follow-ups Due Section */}
          {followupsDue && followupsDue.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    Patients with Follow-ups Due
                  </CardTitle>
                  <Badge variant="secondary">{followupsDue.length}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {followupsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {followupsDue.map((patient) => (
                      <Card
                        key={patient._id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => router.push(`/patients/${patient._id}`)}
                      >
                        <CardContent className="pt-6">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h3 className="font-semibold">{patient.name}</h3>
                              <Badge
                                variant={patient.isOverdue ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                {getDaysUntilText(patient.daysUntilFollowup)}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Age: {patient.age}
                            </div>
                            {patient.currentRemedy && (
                              <div className="flex items-center gap-1 text-sm">
                                <Pill className="h-3 w-3 text-primary" />
                                <span className="font-medium text-primary">
                                  {patient.currentRemedy}
                                </span>
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">
                              Last visit: {formatDate(patient.lastConsultationDate)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Follow-up: {formatDate(patient.followUpDate)}
                            </div>
                            <Button
                              size="sm"
                              className="w-full mt-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/patients/${patient._id}/consultation/${patient.consultationId}/followup`
                                );
                              }}
                            >
                              Add Follow-up
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Patients Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Patients</CardTitle>
                <Button onClick={() => router.push('/patients/new')}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Patient
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={patientFilter} onValueChange={(v) => setPatientFilter(v as any)}>
                <TabsList className="grid w-full grid-cols-4 mb-4">
                  <TabsTrigger value="all">
                    All
                    {patientsData?.patients && (
                      <Badge variant="secondary" className="ml-2">
                        {patientsData.patients.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="followups">
                    Follow-ups Due
                    {followupsDue && followupsDue.length > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {followupsDue.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="recent">Recently Consulted</TabsTrigger>
                  <TabsTrigger value="none">No Consultations</TabsTrigger>
                </TabsList>

                <TabsContent value={patientFilter}>
                  {patientsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2 text-muted-foreground">Loading patients...</span>
                    </div>
                  ) : filteredPatients.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {patientFilter === 'all'
                          ? 'No patients yet. Add your first patient!'
                          : patientFilter === 'followups'
                          ? 'No follow-ups due'
                          : patientFilter === 'recent'
                          ? 'No recent consultations'
                          : 'All patients have consultations'}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Age</TableHead>
                            <TableHead>Last Consultation</TableHead>
                            <TableHead>Current Remedy</TableHead>
                            <TableHead>Follow-up Due</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPatients.map((patient) => {
                            const followup = followupsDue?.find((f) => f._id === patient._id);
                            return (
                              <TableRow
                                key={patient._id}
                                className="cursor-pointer hover:bg-accent"
                                onClick={() => router.push(`/patients/${patient._id}`)}
                              >
                                <TableCell className="font-medium">{patient.name}</TableCell>
                                <TableCell>{patient.age}</TableCell>
                                <TableCell>
                                  {patient.lastConsultationDate ? (
                                    formatDate(patient.lastConsultationDate)
                                  ) : (
                                    <span className="text-muted-foreground">Never</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {patient.currentRemedy ? (
                                    <div className="flex items-center gap-1">
                                      <Pill className="h-3 w-3 text-primary" />
                                      <span className="text-primary font-medium">
                                        {patient.currentRemedy}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {followup ? (
                                    <Badge
                                      variant={followup.isOverdue ? 'destructive' : 'secondary'}
                                    >
                                      {getDaysUntilText(followup.daysUntilFollowup)}
                                    </Badge>
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    {patient.totalConsultations > 0 ? (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          router.push(`/patients/${patient._id}`);
                                        }}
                                      >
                                        View
                                      </Button>
                                    ) : (
                                      <Button
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          router.push(`/patients/${patient._id}/consultation/new`);
                                        }}
                                      >
                                        First Consultation
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
