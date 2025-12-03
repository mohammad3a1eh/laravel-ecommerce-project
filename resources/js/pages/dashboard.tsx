import {PlaceholderPattern} from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import {dashboard} from '@/routes';
import {type BreadcrumbItem} from '@/types';
import {Head, usePage} from '@inertiajs/react';
import {useLaravelReactI18n} from "laravel-react-i18n";
import { Auth } from '@/types';
import {Badge} from "@/components/ui/badge";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    // #localization
    const {t, currentLocale} = useLaravelReactI18n();
    const locale = currentLocale();

    const { auth } = usePage<{ auth: Auth }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard"/>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">

                    <div
                        className="relative aspect-auto overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border justify-center flex flex-col
                        gap-2 p-4
                        "
                    >
                        <h2 className="scroll-m-20 text-xl sm:text-3xl font-semibold tracking-tight first:mt-0">
                            {auth.user.name}
                        </h2>
                        <h4></h4>
                        <small className="text-sm leading-none font-medium">
                            {auth.user.email}
                        </small>
                        <Badge className="rounded-full">{auth.roles}</Badge>
                    </div>
                    <div
                        className="relative aspect-auto overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern
                            className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20"/>
                    </div>
                </div>
                <div
                    className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern
                        className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20"/>
                </div>
            </div>
        </AppLayout>
    );
}
