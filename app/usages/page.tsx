"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "@/components/service/axiosInstance";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import { FiDownload, FiCalendar, FiSearch, FiBarChart2 } from "react-icons/fi";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

export default function UsagesPage() {
  const { token } = useSelector((state) => state.admin);
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ service: "", startDate: "", endDate: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsage();
  }, [filters, page]);

  const fetchUsage = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/user/usage-report", {
        params: { ...filters, page, limit: 10 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsageData(res.data.usage || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error("Failed to fetch usage report");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(usageData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "UsageReport");
    XLSX.writeFile(wb, "UsageReport.xlsx");
  };

  return (
    <div style={{ minHeight: '105vh', padding: '1rem', backgroundColor: '#f9fafb' }}>
  {/* Header Card */}
<div
  style={{
    backgroundColor: '#ffffff',
    padding: '1rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    marginBottom: '1.5rem',
  }}
>
  {/* Header: title + export button */}
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.5rem',
      padding: '0.5rem 0',
      gap: '1rem',
    }}
  >
    {/* Title with icon */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <FiBarChart2 size={24} style={{ color: '#000' }} />
      <h1 style={{ fontSize: '1.125rem', color: '#000' }}>Service Usage Report</h1>
    </div>

    {/* Export button */}
    <Button
      onClick={exportToExcel}
      style={{
        backgroundColor: '#dbeafe',
        color: '#1d4ed8',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      <FiDownload size={16} style={{ marginRight: '0.5rem' }} /> Export
    </Button>
  </div>

  {/* Filters grid */}
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      alignItems: 'end',
    }}
  >
    {/* Service Name */}
    <div>
      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
        Service Name
      </label>
      <input
        type="text"
        style={{
          width: '100%',
          padding: '0.5rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          outline: 'none',
        }}
        onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px #3b82f6')}
        onBlur={(e) => (e.target.style.boxShadow = 'none')}
        value={filters.service}
        onChange={(e) => setFilters({ ...filters, service: e.target.value })}
        placeholder="Filter by service name"
      />
    </div>

    {/* Start Date */}
    <div>
      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
        Start Date
      </label>
      <input
        type="date"
        style={{
          width: '100%',
          padding: '0.5rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          outline: 'none',
        }}
        onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px #3b82f6')}
        onBlur={(e) => (e.target.style.boxShadow = 'none')}
        value={filters.startDate}
        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
      />
    </div>

    {/* End Date */}
    <div>
      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
        End Date
      </label>
      <input
        type="date"
        style={{
          width: '100%',
          padding: '0.5rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          outline: 'none',
        }}
        onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px #3b82f6')}
        onBlur={(e) => (e.target.style.boxShadow = 'none')}
        value={filters.endDate}
        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
      />
    </div>
  </div>
</div>
 



      {/* Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6 flex flex-col gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 w-full bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-blue-50">
                <tr>
                 
                </tr>
                <tr>
                  {["Service", "Hit Count", "Total Charges", "Last Used"].map(header => (
                    <th 
                      key={header} 
                      className="p-3 md:p-4 text-left text-xs font-semibold text-gray-500 uppercase"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usageData.length ? (
                  usageData.map((entry, idx) => (
                    <tr 
                      key={idx} 
                      className="transition-colors hover:bg-gray-50 border-t border-gray-100"
                    >
                      <td className="p-3 md:p-4 text-sm font-medium">{entry.service}</td>
                      <td className="p-3 md:p-4 text-sm">{entry.hitCount}</td>
                      <td className="p-3 md:p-4 text-sm">₹{entry.totalCharge?.toFixed(2)}</td>
                      <td className="p-3 md:p-4 text-sm text-gray-500">
                        {new Date(entry.lastUsed || Date.now()).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FiBarChart2 size={40} className="text-gray-400" />
                        <h3 className="text-lg font-semibold">No usage data found</h3>
                        <p className="text-gray-500">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col gap-3 mt-6 items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing page {page} of {totalPages} • {usageData.length} results
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  
  );
}
