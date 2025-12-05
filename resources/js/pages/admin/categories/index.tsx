'use client';

import { Inertia } from '@inertiajs/inertia';
import { useEffect } from "react";
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
import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { route } from 'ziggy-js';
import type { BreadcrumbItem } from '@/types';

interface Category {
    id: number;
    name_fa: string;
    parent?: { name_fa: string } | null;
    is_active: boolean;
    image?: string | null;
}

export default function Categories() {
    const {t, currentLocale} = useLaravelReactI18n();
    const locale = currentLocale();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t("dashboard"),
            href: route("dashboard"),
        },
        {
            title: t("categories"),
            href: route("admin.categories.index"),
        }
    ];

    const { categories } = usePage<{ categories: Category[] }>().props;

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const [globalFilter, setGlobalFilter] = useState('');

    const customCategoryFilter = (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const value = filterValue.toString().toLowerCase();

        const name = row.original.name_fa?.toString().toLowerCase() ?? "";
        const parent = row.original.parent?.name_fa?.toString().toLowerCase() ?? "";
        const status = row.original.is_active ? "active فعال" : "inactive غیرفعال";

        return (
            name.includes(value) ||
            parent.includes(value) ||
            status.includes(value)
        );
    };


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setColumnVisibility({
                    id: false,
                    name_fa: true,
                    parent: false,
                    is_active: true,
                    image: false,
                    actions: true,
                });
            } else {
                setColumnVisibility({
                    id: true,
                    name_fa: true,
                    parent: true,
                    is_active: true,
                    image: true,
                    actions: true,
                });
            }
        };

        handleResize(); // اجرا روی mount
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const columns: ColumnDef<Category>[] = [
        { accessorKey: 'id', header: t("id") },
        { accessorKey: 'name_fa', header: t("name fa") },
        {
            accessorFn: (row) => row.parent?.name_fa ?? '-',
            id: 'parent',
            header: t("parent"),
        },
        {
            accessorKey: 'is_active',
            header: t("status"),
            cell: ({ row }) => (
                <Badge
                    className={`${row.original.is_active ? 'bg-green-500' : 'bg-red-500'} rounded-full`}
                >
                    {row.original.is_active ? t("active") : t("inactive")}
                </Badge>
            ),
        },
        {
            accessorKey: 'image',
            header: t("image"),
            cell: ({ row }) =>
                row.original.image ? (
                    <img
                        src={`/storage/${row.original.image}`}
                        className="h-8 w-8 rounded object-cover mx-auto "
                    />
                ) : (
                    '-'
                ),
        },
        {
            id: 'actions',
            header: t("actions"),
            cell: ({ row }) => (
                <div className="flex justify-center gap-2 flex-col border rounded-md m-1 p-1">
                    <Link href={route("admin.categories.edit", row.original.id)}>
                        <Button size="sm" variant="outline" className="w-full">
                            {t("edit")}
                        </Button>
                    </Link>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                                {t("delete")}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir={locale === "fa" ? "rtl" : "ltr"}>
                            <AlertDialogHeader>
                                <AlertDialogTitle className={locale === "fa" ? "text-right" : "text-left"}>
                                    {t("you are deleting the :category category", {category: row.original.name_fa})}
                                </AlertDialogTitle>
                                <AlertDialogDescription className={locale === "fa" ? "text-right" : "text-left"}>
                                    {t("are you sure you want to do this")}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex justify-end gap-2">
                                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => {
                                        router.delete(route("admin.categories.destroy", row.original.id), {
                                            onSuccess: () => {
                                                // پیام موفقیت همان لحظه در صفحه
                                                toast.success(t("category deleted successfully"));
                                                setTimeout(() => {
                                                    router.reload({ preserveState: true });
                                                }, 1500);
                                            },
                                            onError: () => {
                                                toast.error(t("category delete failed"));
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
        data: categories,
        columns,
        state: { columnVisibility, globalFilter },
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: customCategoryFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t("categories")} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                <div className="flex flex-wrap items-center gap-2 md:flex-row justify-between">
                    <h3>{t("categories")}</h3>

                    <Link href={route("admin.categories.create")}>
                        <Button variant="outline">
                            {t("create category")}
                        </Button>
                    </Link>
                </div>

                <Card className="p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                        {/* Search */}
                        <Input
                            placeholder={t("search") + "..."}
                            value={globalFilter ?? ''}
                            onChange={(e) =>
                                table.setGlobalFilter(e.target.value)
                            }
                            className="max-w-sm"
                        />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    {t("columns")}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                {table
                                    .getAllColumns()
                                    .filter((col) => col.id !== 'actions')
                                    .map((col) => (
                                        <DropdownMenuCheckboxItem
                                            key={col.id}
                                            checked={col.getIsVisible()}
                                            onCheckedChange={() =>
                                                col.toggleVisibility(
                                                    !col.getIsVisible(),
                                                )
                                            }
                                        >
                                            {
                                                col.columnDef
                                                    .header as React.ReactNode
                                            }
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Table */}
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((hg) => (
                                    <TableRow key={hg.id}>
                                        {hg.headers.map((header) => (
                                            <TableHead key={header.id} className="text-center">
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}
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
                                            {t("no categories found")}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>

                        </Table>
                    </div>


                    {/* Pagination */}
                    <div className="flex items-center justify-between">
                        <div className="space-x-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                {t("previous")}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                {t("next")}
                            </Button>
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
