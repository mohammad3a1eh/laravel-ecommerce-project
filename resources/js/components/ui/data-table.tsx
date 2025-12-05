'use client';

import React, { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    type ColumnDef,
    type RowData,
} from '@tanstack/react-table';
import { Input } from './input';
import { Checkbox } from './checkbox';
import { Button } from './button';

interface DataTableProps<TData extends RowData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    enableRowSelection?: boolean;
    initialRowsPerPage?: number;
    searchable?: boolean;
}

export function DataTable<TData extends RowData>({
                                                     data,
                                                     columns,
                                                     enableRowSelection = false,
                                                     initialRowsPerPage = 10,
                                                     searchable = true,
                                                 }: DataTableProps<TData>) {
    const [visibleColumns, setVisibleColumns] = useState<string[]>(columns.map((c) => c.id!));
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

    const filteredData = useMemo(() => {
        if (!search) return data;
        const lowerSearch = search.toLowerCase();
        return data.filter((row) =>
            columns.some(
                (col) =>
                    col.id &&
                    String((row as any)[col.id] ?? '').toLowerCase().includes(lowerSearch)
            )
        );
    }, [data, search, columns]);

    const paginatedData = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filteredData.slice(start, start + rowsPerPage);
    }, [filteredData, page, rowsPerPage]);

    const toggleColumn = (colId: string) => {
        setVisibleColumns((prev) =>
            prev.includes(colId) ? prev.filter((c) => c !== colId) : [...prev, colId]
        );
    };

    const table = useReactTable({
        data: paginatedData,
        columns: columns.filter((col) => visibleColumns.includes(col.id!)),
        getCoreRowModel: getCoreRowModel(),
        enableRowSelection,
    });

    return (
        <div className="flex flex-col gap-4">
            {searchable && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <Input
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-xs"
                    />

                    <div className="flex gap-2 items-center flex-wrap">
                        {columns.map(
                            (col) =>
                                col.id &&
                                col.id !== 'actions' && (
                                    <label key={col.id} className="flex items-center gap-1">
                                        <Checkbox
                                            checked={visibleColumns.includes(col.id!)}
                                            onCheckedChange={() => toggleColumn(col.id!)}
                                        />
                                        {col.header as React.ReactNode}
                                    </label>
                                )
                        )}
                    </div>
                </div>
            )}

            <div className="overflow-x-auto border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                                >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-4 py-2 text-sm text-gray-700">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-2 flex-wrap gap-2">
                <div>
                    <label>
                        Rows per page:
                        <select
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setPage(1);
                            }}
                            className="ml-2 border rounded p-1"
                        >
                            {[5, 10, 20, 50].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <div className="flex gap-2 items-center">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                    >
                        Prev
                    </Button>
                    <span>Page {page}</span>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                            setPage((prev) =>
                                prev * rowsPerPage < filteredData.length ? prev + 1 : prev
                            )
                        }
                        disabled={page * rowsPerPage >= filteredData.length}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

export type { ColumnDef };
