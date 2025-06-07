"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "@/components/service/axiosInstance";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import { FiDownload, FiCalendar, FiSearch, FiBarChart2 } from "react-icons/fi";
import { Pagination } from "@/components/ui/pagination";
import "./usages.css"; // External CSS for styling


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
    <div className="usage-page">
      <div className="header">
        <FiBarChart2 size={24} color="#2563eb" />
        <h2>Service Usage Report</h2>
      </div>

      <div className="filter-grid">
        <div className="filter-full">
          <label>
            <FiSearch className="icon" /> Service Name
          </label>
          <input
            type="text"
            value={filters.service}
            onChange={(e) => setFilters({ ...filters, service: e.target.value })}
            placeholder="Filter by service name"
          />
        </div>

        <div className="filter-half">
          <label>
            <FiCalendar className="icon" /> Start Date
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
        </div>

        <div className="filter-half">
          <label>
            <FiCalendar className="icon" /> End Date
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </div>

        <button onClick={exportToExcel} className="export-btn">
          <FiDownload size={16} /> Export
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading"><Loader2 className="spin" /></div>
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

      {!loading && totalPages > 1 && (
        <div className="pagination-container">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
