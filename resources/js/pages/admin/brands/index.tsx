'use client';

import { Inertia } from '@inertiajs/inertia';
import { useEffect, useState } from "react";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    type VisibilityState,
} from '@tanstack/react-table';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { router } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { route } from 'ziggy-js';
import { SquarePen, Trash } from 'lucide-react';

interface Brand {
    id: number;
    name_fa: string;
    name_en: string;
    slug: string;
    image?: string | null;
    website?: string | null;
    is_active: boolean;
}

export default function Brands() {
    const {t, currentLocale} = useLaravelReactI18n();
    const locale = currentLocale();

    const { brands } = usePage<{ brands: Brand[] }>().props;

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [globalFilter, setGlobalFilter] = useState('');

    const customBrandFilter = (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const value = filterValue.toString().trim().toLowerCase();

        const nameFa = row.original.name_fa?.toLowerCase() ?? "";
        const nameEn = row.original.name_en?.toLowerCase() ?? "";
        const slug = row.original.slug?.toLowerCase() ?? "";

        return (
            nameFa.includes(value) ||
            nameEn.includes(value) ||
            slug.includes(value)
        );
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setColumnVisibility({
                    id: false,
                    name_fa: true,
                    name_en: false,
                    slug: false,
                    website: false,
                    image: false,
                    actions: true,
                });
            } else {
                setColumnVisibility({
                    id: true,
                    name_fa: true,
                    name_en: true,
                    slug: true,
                    website: true,
                    image: true,
                    actions: true,
                });
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const columns: ColumnDef<Brand>[] = [
        { accessorKey: 'id', header: t("id") },
        { accessorKey: 'name_fa', header: t("name fa") },
        { accessorKey: 'name_en', header: t("name en") },
        { accessorKey: 'slug', header: t("slug") },
        { accessorKey: 'website', header: t("website"), cell: ({ row }) =>
                row.original.website ? (
                    <a href={row.original.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        {row.original.website}
                    </a>
                ) : '-'
        },
        {
            accessorKey: 'image',
            header: t("image"),
            cell: ({ row }) =>
                row.original.image ? (
                    <img
                        src={`/storage/${row.original.image}`}
                        className="h-8 w-8 rounded object-cover mx-auto"
                    />
                ) : '-',
        },
        {
            id: 'actions',
            header: t("actions"),
            cell: ({ row }) => (
                <div className="flex justify-center gap-2 flex-col border rounded-md m-1 p-1 w-fit items-center mx-auto">
                    <Link href={route("admin.brands.edit", row.original.id)}>
                        <Button size="sm" variant="outline" className="flex w-fit">
                            <SquarePen />
                        </Button>
                    </Link>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" className="flex w-fit">
                                <Trash />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir={locale === "fa" ? "rtl" : "ltr"}>
                            <AlertDialogHeader>
                                <AlertDialogTitle className={locale === "fa" ? "text-right" : "text-left"}>
                                    {t("you are deleting the :brand brand", {brand: row.original.name_fa})}
                                </AlertDialogTitle>
                                <AlertDialogDescription className={locale === "fa" ? "text-right" : "text-left"}>
                                    {t("are you sure you want to do this")}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex justify-end gap-2">
                                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => {
                                        router.delete(route("admin.brands.destroy", row.original.id), {
                                            onSuccess: () => {
                                                toast.success(t("brand deleted successfully"));
                                                setTimeout(() => {
                                                    router.reload({ preserveState: true });
                                                }, 1500);
                                            },
                                            onError: () => {
                                                toast.error(t("brand delete failed"));
                                                setTimeout(() => {
                                                    router.reload({ preserveState: true });
                                                }, 1500);
                                            }
                                        });
                                    }}
                                >
                                    {t("delete")}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            ),
            enableHiding: false,
        },
    ];

    const table = useReactTable({
        data: brands,
        columns,
        state: { columnVisibility, globalFilter },
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: customBrandFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <AppLayout breadcrumbs={[
            { title: t("dashboard"), href: route("dashboard") },
            { title: t("brands"), href: route("admin.brands.index") },
        ]}>
            <Head title={t("brands")} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-center gap-2 md:flex-row justify-between">
                    <h3>{t("brands")}</h3>
                    <Link href={route("admin.brands.create")}>
                        <Button variant="outline">{t("create brand")}</Button>
                    </Link>
                </div>

                <Card className="p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                        <Input
                            placeholder={t("search") + "..."}
                            value={globalFilter ?? ''}
                            onChange={(e) => table.setGlobalFilter(e.target.value)}
                            className="max-w-sm"
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">{t("columns")}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                {table.getAllColumns().filter((col) => col.id !== 'actions').map((col) => (
                                    <DropdownMenuCheckboxItem
                                        key={col.id}
                                        checked={col.getIsVisible()}
                                        onCheckedChange={() => col.toggleVisibility(!col.getIsVisible())}
                                    >
                                        {col.columnDef.header as React.ReactNode}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((hg) => (
                                    <TableRow key={hg.id}>
                                        {hg.headers.map((header) => (
                                            <TableHead key={header.id} className="text-center">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.length > 0 ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="justify-center text-center">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="text-center py-4 text-muted-foreground">
                                            {t("no brands found")}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <div className="space-x-2">
                            <Button size="sm" variant="outline" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>{t("previous")}</Button>
                            <Button size="sm" variant="outline" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>{t("next")}</Button>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {t("page :index of :max", {index: table.getState().pagination.pageIndex + 1, max: table.getPageCount()})}
                        </div>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
