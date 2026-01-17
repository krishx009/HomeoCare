'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLogout } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
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
  LayoutDashboard,
  Users,
  Search,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'All Patients',
    href: '/patients',
    icon: Users,
  },
  {
    name: 'Search Patients',
    href: '/patients/search',
    icon: Search,
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const logoutMutation = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold text-primary">HomeoCare</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigationItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                            isActive
                              ? 'bg-primary text-white'
                              : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                          )}
                        >
                          <item.icon
                            className={cn(
                              'h-5 w-5 shrink-0',
                              isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary'
                            )}
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>

              {/* User Profile at bottom */}
              <li className="mt-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50 rounded-md w-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(user?.displayName || null)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="sr-only">Your profile</span>
                      <span aria-hidden="true" className="truncate">
                        {user?.displayName || 'Doctor'}
                      </span>
                    </button>
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
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile menu */}
      <div className="lg:hidden">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="flex flex-1 items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold text-primary">HomeoCare</span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
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
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
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

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="relative z-50 lg:hidden">
            <div className="fixed inset-0 bg-gray-900/80" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed inset-0 flex">
              <div className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <X className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-white font-bold text-lg">H</span>
                      </div>
                      <span className="text-xl font-bold text-primary">HomeoCare</span>
                    </Link>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigationItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                            return (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={cn(
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                                    isActive
                                      ? 'bg-primary text-white'
                                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                                  )}
                                >
                                  <item.icon
                                    className={cn(
                                      'h-5 w-5 shrink-0',
                                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary'
                                    )}
                                  />
                                  {item.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}
