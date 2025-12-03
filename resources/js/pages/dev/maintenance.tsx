import React from 'react';
import AppLayout from '@/layouts/app-layout';
import {Head, useForm} from '@inertiajs/react';
import {Button} from '@/components/ui/button';
import {type BreadcrumbItem} from '@/types';
import {route} from 'ziggy-js';
import {useLaravelReactI18n} from "laravel-react-i18n";
import {PlaceholderPattern} from "@/components/ui/placeholder-pattern";
import {Server, ServerOff, TrafficCone} from "lucide-react";

interface Props {
    isDown: boolean;
}

export default function Maintenance({isDown}: Props) {
    const { t, currentLocale } = useLaravelReactI18n();
    const locale = currentLocale();

    const {post, processing} = useForm({});

    const breadcrumbs: BreadcrumbItem[] = [
        {title: t("dashboard"), href: '/dashboard'},
        {title: t("maintenance"), href: '/dev/maintenance'},
    ];

    const toggleMaintenance = () => {
        post(route('maintenance.toggle'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t("maintenance")} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 items-center justify-center">
                <div className="flex flex-col py-12 px-4 gap-3">
                    {/*<TrafficCone size={100} className="mx-auto text-orange-400"/>*/}

                    <TrafficCone
                        size={100}
                        className="mx-auto text-orange-400"
                        style={{
                            animation: 'shake 2.0s ease-in-out infinite',
                        }}
                    />

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                        {t("site maintenance mode")}
                    </h1>

                    <p className="text-center text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2"
                       dir={locale == 'fa' ? 'rtl' : 'ltr'}>
                        {t("status")}: {isDown ? t("offline") : t("online")}
                        <span
                            className={`h-3 w-3 rounded-full ${
                                isDown ? 'bg-red-500 animate-pulse' : 'bg-green-500 animate-pulse'
                            }`}
                        ></span>
                    </p>

                    <Button
                        type="button"
                        onClick={toggleMaintenance}
                        disabled={processing}
                        className="px-6 py-2"
                    >
                        {isDown ? t("disable maintenance mode") : t("enable maintenance mode")}
                    </Button>
                </div>
            </div>


        </AppLayout>
    );
}
