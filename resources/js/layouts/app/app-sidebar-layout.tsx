import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { Toaster } from "@/components/ui/sonner";

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {


    const { t, currentLocale } = useLaravelReactI18n();
    const locale = currentLocale();

    return (
        <AppShell variant="sidebar" >
            <Toaster
                position="top-center"
                richColors
                closeButton={true}
                duration={1500}
                dir="auto"
            />
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden" dir={locale == 'fa' ? 'rtl' : 'ltr'}>
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
