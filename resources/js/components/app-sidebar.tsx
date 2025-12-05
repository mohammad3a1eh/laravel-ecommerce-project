import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    Globe,
    Github,
    LayoutGrid,
    TrafficCone,
    Tag
} from 'lucide-react';
import AppLogo from './app-logo';
import { useLaravelReactI18n } from "laravel-react-i18n";
import {route} from "ziggy-js";

export function AppSidebar() {
    const { t, currentLocale } = useLaravelReactI18n();
    const locale = currentLocale();

    const mainNavItems: NavItem[] = [
        {
            title: t("dashboard"),
            href: route("dashboard"),
            icon: LayoutGrid,

        },
    ];

    const developerNavItems: NavItem[] = [
        {
            title: t("maintenance"),
            href: route("maintenance.index"),
            icon: TrafficCone,
        },
    ];

    const ShopNavItems: NavItem[] = [
        {
            title: t("categories"),
            href: route("admin.categories.index"),
            icon: Tag,
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: t("github"),
            href: 'https://github.com/HamCodeTeam/',
            icon: Github,
        },
        {
            title: t("website"),
            href: 'https://hamcode-team.ir/',
            icon: Globe,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset"  dir={locale == 'fa' ? 'rtl' : 'ltr'}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} groupLabel={t("global")}/>
                <NavMain items={ShopNavItems} groupLabel={t("shop")}/>
                <NavMain items={developerNavItems} groupLabel={t("developer")}/>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
