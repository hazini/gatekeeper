'use client';

import { useState, useEffect } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { LicenseForm } from './LicenseForm';
import { api } from '../services/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowUpDown } from 'lucide-react';

interface License {
  id: number;
  url: string;
  token: string;
  status: boolean;
  created_at: string;
}

interface LicenseTableProps {
  onLicenseChange: () => void;
}

export function LicenseTable({ onLicenseChange }: LicenseTableProps) {
  const [data, setData] = useState<License[]>([]);
  const [editingLicense, setEditingLicense] = useState<License | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState(0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns: ColumnDef<License>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-2"
          >
            ID
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: 'url',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-2"
          >
            URL
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: 'token',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-2"
          >
            Token
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-2"
          >
            Status
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Badge variant={row.original.status ? "success" : "destructive"}>
          {row.original.status ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-2"
          >
            Created At
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => formatDate(row.original.created_at),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const license = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditingLicense(license)}>
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(license.id)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: Math.ceil(totalRows / pagination.pageSize),
    onPaginationChange: setPagination,
  });

  const fetchLicenses = async () => {
    try {
      const sortField = sorting.length > 0 ? sorting[0].id : undefined;
      const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined;
      
      const filters: Record<string, string> = {};
      columnFilters.forEach((filter) => {
        if (typeof filter.value === 'string') {
          filters[filter.id] = filter.value;
        }
      });

      const response = await api.get('/licenses', {
        params: {
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          sortBy: sortField,
          sortOrder: sortOrder,
          filters: JSON.stringify(filters),
        },
      });
      
      setData(response.data.data);
      setTotalRows(response.data.total);
    } catch (error) {
      console.error('Failed to fetch licenses:', error);
    }
  };

  // Fetch licenses when component mounts or when dependencies change
  useEffect(() => {
    fetchLicenses();
  }, [sorting, columnFilters, pagination]);

  // Fetch licenses when onLicenseChange is called
  useEffect(() => {
    fetchLicenses();
  }, [onLicenseChange]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this license?')) {
      try {
        await api.delete(`/licenses/${id}`);
        onLicenseChange();
      } catch (error) {
        console.error('Failed to delete license:', error);
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter URLs..."
          value={(table.getColumn('url')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('url')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <Select
            value={pagination.pageSize.toString()}
            onValueChange={(value) =>
              setPagination((prev) => ({ ...prev, pageSize: Number(value), pageIndex: 0 }))
            }
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={pagination.pageSize} />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {pagination.pageIndex + 1} of {Math.ceil(totalRows / pagination.pageSize)}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      <Dialog open={!!editingLicense} onOpenChange={() => setEditingLicense(null)}>
        <DialogContent>
          {editingLicense && (
            <LicenseForm
              license={editingLicense}
              onSuccess={() => {
                setEditingLicense(null);
                onLicenseChange();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
