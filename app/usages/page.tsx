"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "@/components/service/axiosInstance";
import { toast } from "react-toastify";
import { Loader2, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as XLSX from 'xlsx';
import { Pagination } from "@/components/ui/pagination";

export default function UsagesPage() {
  const { token } = useSelector((state) => state.admin);
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ service: "", startDate: "", endDate: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsage = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/user/usage-report", {
        params: { ...filters, page, limit: 10 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsageData(res.data.usage || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error("Failed to fetch usage report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, [filters, page]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(usageData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "UsageReport");
    XLSX.writeFile(wb, "UsageReport.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mb-6 grid md:grid-cols-4 gap-4">
        <Input
          placeholder="🔍 Filter by service name"
          value={filters.service}
          onChange={(e) => setFilters({ ...filters, service: e.target.value })}
        />
        <Input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
        />
        <Input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        />
        <Button onClick={exportToExcel} className="w-full">
          <Download className="mr-2 h-4 w-4" /> Export to Excel
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">📈 Service Usage Report</h2>
        </div>

        {loading ? (
          <div className="p-6 flex justify-center items-center">
            <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Service</th>
                  <th className="px-6 py-3 text-left font-medium">Hit Count</th>
                  <th className="px-6 py-3 text-left font-medium">Total Charges</th>
                  <th className="px-6 py-3 text-left font-medium">Last Used</th>
                </tr>
              </thead>
              <tbody>
                {usageData.length ? usageData.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{entry.service}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{entry.hitCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">₹{entry.totalCharge?.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(entry.lastUsed || Date.now()).toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">No usage data found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="p-4 border-t">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
