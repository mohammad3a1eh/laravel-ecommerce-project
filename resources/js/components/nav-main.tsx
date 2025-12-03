import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { CornerDownLeft, CornerDownRight } from 'lucide-react';
import {route} from "ziggy-js";
import { useLaravelReactI18n } from 'laravel-react-i18n';

interface NavMainProps {
    items: NavItem[];
    groupLabel?: string;
}

export function isRouteActive(name: string, params: any = {}) {
    const routePath = new URL(name).pathname;
    const currentPath = window.location.pathname;

    return currentPath === routePath ;
}

export function NavMain({ items = [], groupLabel = 'Platform' }: NavMainProps) {
    const page = usePage();

    const {t, currentLocale} = useLaravelReactI18n();
    const locale = currentLocale();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isRouteActive(item.href)}
                            tooltip={{ children: item.title }}
                        >
                            <Link
                                href={item.href}
                                prefetch
                            >
                                { }
                                {isRouteActive(item.href)
                                    ? (locale === 'fa' ? <CornerDownLeft /> : <CornerDownRight />)
                                    : item.icon && <item.icon />
                                }
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
