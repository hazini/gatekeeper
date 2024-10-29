"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, Loader2 } from "lucide-react"
import { SortingState, ColumnFiltersState, PaginationState } from "@tanstack/react-table"
import debounce from "lodash/debounce"
import Cookies from 'js-cookie'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { LicenseForm } from "@/components/LicenseForm"
import { Sidebar } from "@/components/Sidebar"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { api } from "@/services/api"
import { License } from "./columns"

// Type for the form's license data
interface FormLicense {
  id: number;
  domain: string;
  token: string;
  status: boolean;
}

// Helper function to format dates
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    if (!isNaN(date.getTime())) {
      return date.toLocaleString()
    }
    return dateString
  } catch {
    return dateString
  }
}

export default function LicensesPage() {
  const router = useRouter()
  const [isAddingLicense, setIsAddingLicense] = useState(false)
  const [editingLicense, setEditingLicense] = useState<FormLicense | undefined>(undefined)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [totalRows, setTotalRows] = useState(0)

  // Check authentication
  useEffect(() => {
    if (typeof window !== "undefined" && !Cookies.get("token")) {
      router.push("/login")
    }
  }, [router])

  const handleLicenseSuccess = useCallback(() => {
    setIsAddingLicense(false)
    setEditingLicense(undefined)
    setRefreshTrigger((prev) => prev + 1)
  }, [])

  const handleEdit = (license: License) => {
    // Transform the table license data to the form format
    setEditingLicense({
      id: parseInt(license.id),
      domain: license.domain,
      token: license.token,
      status: license.status === "Active",
    })
  }

  // Create a debounced refresh trigger
  const debouncedRefreshTrigger = useMemo(
    () => debounce(() => {
      setRefreshTrigger(prev => prev + 1)
    }, 500),
    []
  )

  // Watch for filter changes and trigger debounced refresh
  useEffect(() => {
    debouncedRefreshTrigger()
  }, [columnFilters, debouncedRefreshTrigger])

  useEffect(() => {
    const fetchLicenses = async () => {
      setLoading(true)
      
      try {
        const sortField = sorting.length > 0 ? sorting[0].id : undefined
        const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined
        
        // Map frontend field names to backend field names
        const fieldMapping: Record<string, string> = {
          domain: 'domain',
          token: 'token',
          status: 'status',
          createdAt: 'created_at',
          updatedAt: 'updated_at'
        }

        // Build filters object
        const filters: Record<string, string> = {}
        columnFilters.forEach((filter) => {
          if (filter.value) {
            // Map the filter field to backend field name
            const backendField = fieldMapping[filter.id] || filter.id
            // For string fields, use the filter value directly
            if (typeof filter.value === 'string') {
              filters[backendField] = filter.value
            }
          }
        })

        // Map the sort field to backend field name
        const backendSortField = sortField ? (fieldMapping[sortField] || sortField) : undefined

        const params: Record<string, any> = {
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          sortBy: backendSortField,
          sortOrder: sortOrder,
        }

        // Only add filters if there are any
        if (Object.keys(filters).length > 0) {
          params.filters = JSON.stringify(filters)
        }

        const response = await api.get("/licenses", { params })

        const licensesData = Array.isArray(response.data) ? response.data : response.data.data
        const total = response.data.total || licensesData.length
        
        const formattedLicenses = licensesData.map((license: any) => ({
          id: license.id.toString(),
          domain: license.domain,
          token: license.token,
          status: license.status ? "Active" : "Inactive",
          createdAt: formatDate(license.createdAt),
          updatedAt: formatDate(license.updatedAt || license.createdAt),
        }))
        
        setLicenses(formattedLicenses)
        setTotalRows(total)
      } catch (error) {
        console.error("Failed to fetch licenses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLicenses()
  }, [refreshTrigger, sorting, pagination])

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="relative ml-auto flex-1 md:grow-0">
          </div>
          <Button
            size="sm"
            className="h-8 gap-1"
            onClick={() => setIsAddingLicense(true)}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add License
            </span>
          </Button>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Licenses</CardTitle>
              <CardDescription>
                Manage licenses and view their status.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              {loading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Loading licenses...</span>
                  </div>
                </div>
              )}
              <DataTable 
                columns={columns(handleEdit)} 
                data={licenses}
                sorting={sorting}
                setSorting={setSorting}
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
                pagination={pagination}
                setPagination={setPagination}
                pageCount={Math.ceil(totalRows / pagination.pageSize)}
              />
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Add/Edit License Dialog */}
      <Sheet
        open={isAddingLicense || !!editingLicense}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setIsAddingLicense(false)
            setEditingLicense(undefined)
          }
        }}
      >
        <SheetContent>
          <LicenseForm
            license={editingLicense}
            onSuccess={handleLicenseSuccess}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
