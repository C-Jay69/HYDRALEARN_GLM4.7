import { AppLogo } from '@/components/app-logo';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { AppFooter } from '@/components/app-footer';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="border-r border-sidebar-border"
      >
        <SidebarHeader>
          <AppLogo />
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:pt-4">
          <SidebarTrigger className="sm:hidden" />
          <div className="ml-auto flex items-center gap-2">
            <UserNav />
          </div>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:pb-6">{children}</main>
        <AppFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}
