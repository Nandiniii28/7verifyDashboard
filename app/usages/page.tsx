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
import "./usages.css";
export default function UsagesPage() {
  const { admin, token } = useSelector((state) => state.admin);
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ service: "", startDate: "", endDate: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const mode = admin?.environment_mode
  useEffect(() => {
    fetchUsage();
  }, [filters, page, mode]);

  const fetchUsage = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/user/usage-report", {
        params: { ...filters, page, limit: 10, mode },
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
    <div className="usage-page">
      <div className="header">

        <h2 className="flex gap-1">
          <FiBarChart2 size={24} color="#2563eb d" /> Service Usage Report
        </h2>

        <button onClick={exportToExcel} className="export-btn">
          <FiDownload size={16} /> Export
        </button>



      </div>


      <div className="filter-grid">
        {/* Row 1: Four items */}
        <div className="filter-item">
          <label>
            Service Name
          </label>
          <input
            type="text"
            value={filters.service}
            onChange={(e) => setFilters({ ...filters, service: e.target.value })}
            placeholder="Filter by service name"
          />
        </div>

        <div className="filter-item">
          <label>
            Start Date
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
        </div>

        <div className="filter-item">
          <label>
            End Date
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </div>

        {/* Optional filler for 4th column if needed */}



      </div>


      <div className="table-container">
        {loading ? (
          <div className="p-6 flex flex-col gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 w-full bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <table className="usage-table">
            <thead>
              <tr>
                <th colSpan={4} className="data">Service Usage Report</th>
              </tr>
              <tr>
                <td>Service</td>
                <td>Hit Count</td>
                <td>Total Charges</td>
                <td>Last Used</td>
              </tr>
            </thead>
            <tbody>

              {usageData.length ? (
                usageData.map((entry, idx) => (
                  <tr key={idx}>
                    <td>{entry.service}</td>
                    <td>{entry.hitCount}</td>
                    <td>₹{entry.totalCharge?.toFixed(2)}</td>
                    <td>{new Date(entry.lastUsed || Date.now()).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <th colSpan={4} className="no-data">No usage data found.</th>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col gap-3 mt-6 items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing page {page} of {totalPages} • {usageData.length} results
          </div>
        </div>
      )
      }
    </div>
  );
}
