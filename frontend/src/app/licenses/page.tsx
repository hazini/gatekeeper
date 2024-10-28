'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  Key,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  Shield,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '../../components/ui/tooltip';
import { Button } from '../../components/ui/button';
import { LicenseForm } from '../../components/LicenseForm';
import { LicenseTable } from '../../components/LicenseTable';

export default function LicensesPage() {
  const router = useRouter();
  const [isAddingLicense, setIsAddingLicense] = useState(false);
  const [editingLicense, setEditingLicense] = useState<any>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // If no token, don't render anything (will redirect)
  if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
    router.push('/login');
    return null;
  }

  const handleLicenseSuccess = useCallback(() => {
    setIsAddingLicense(false);
    setEditingLicense(undefined);
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <Link
              href="/"
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            >
              <Shield className="h-4 w-4 transition-all group-hover:scale-110" />
              <span className="sr-only">Gatekeeper</span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/licenses"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Key className="h-5 w-5" />
                  <span className="sr-only">Licenses</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Licenses</TooltipContent>
            </Tooltip>
          </nav>
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/settings"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </nav>
        </aside>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link
                    href="/"
                    className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                  >
                    <Shield className="h-5 w-5 transition-all group-hover:scale-110" />
                    <span className="sr-only">Gatekeeper</span>
                  </Link>
                  <Link
                    href="/"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <Home className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link
                    href="/licenses"
                    className="flex items-center gap-4 px-2.5 text-foreground"
                  >
                    <Key className="h-5 w-5" />
                    Licenses
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search licenses..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
            <Button size="sm" className="h-8 gap-1" onClick={() => setIsAddingLicense(true)}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add License
              </span>
            </Button>
          </header>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Licenses</CardTitle>
                <CardDescription>
                  Manage your software licenses and view their status.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LicenseTable onLicenseChange={handleLicenseSuccess} key={refreshTrigger} />
              </CardContent>
            </Card>
          </main>
        </div>

        {/* Add/Edit License Dialog */}
        <Sheet 
          open={isAddingLicense || !!editingLicense} 
          onOpenChange={(open) => {
            if (!open) {
              setIsAddingLicense(false);
              setEditingLicense(undefined);
            }
          }}
        >
          <SheetContent>
            <LicenseForm
              license={editingLicense}
              onSuccess={handleLicenseSuccess}
            />
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  );
}
