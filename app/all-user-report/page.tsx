"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { FaUserGroup } from "react-icons/fa6";

import "./all-user-report.css"; // import CSS file

export default function AllUserReportPage() {
  const isMobile = useIsMobile();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosInstance.get("/admin/report", {
        params: {
          search,
          service: serviceFilter,
          page,
          limit,
        },
      });

      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    try {
      const res = await axiosInstance.get("/admin/report", {
        params: {
          search,
          service: serviceFilter,
          export: type,
        },
        responseType: "blob",
      });

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `usage-report.${type === "csv" ? "csv" : "xlsx"}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Export failed");
    }
  };

  useEffect(() => {
    fetchReport();
  }, [search, serviceFilter, page]);

  return (
    <>
      <h4 className="title padding: 16px 32px; ">
        <FaUserGroup  className="icon" size={28} />
        All User Report
      </h4>
      <div className="page-container">
        <div className="card">
          <div className="header-row flex justify-between items-center">
            <div className="controls flex gap-4">
              <Input
                placeholder="Search name/email"
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                className="input-small"
              />
              <Input
                placeholder="Filter by service"
                value={serviceFilter}
                onChange={(e) => {
                  setPage(1);
                  setServiceFilter(e.target.value);
                }}
                className="input-small"
              />
            </div>

            <div className="export-buttons flex gap-2">
              <button
                onClick={() => handleExport("csv")}
                className="inline-flex items-center bg-blue-100 px-3 py-2 text-xs font-medium text-blue-800 hover:bg-blue-200 cursor-pointer rounded"
              >
                Export CSV
              </button>
              <button
                onClick={() => handleExport("csv")}
                className="inline-flex items-center bg-green-100 px-3 py-2 text-xs font-medium text-green-800 hover:bg-green-200 cursor-pointer rounded"
              >
                Export Excel
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Table */}
          <div className="table-container">
            {loading ? (
              <div className="loading-text">Loading...</div>
            ) : users.length === 0 ? (
              <div className="loading-text">No users found.</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Service</th>
                    <th>Hit Count</th>
                    <th>Total Charges</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) =>
                    user.serviceUsage.map((service, index) => (
                      <tr key={`${user._id}-${index}`}>
                        <td>{user.name}</td>
                        <td className="text-muted">{user.email}</td>
                        <td>{service.service}</td>
                        <td className="text-green">{service.hitCount}</td>
                        <td>₹ {service.totalCharge?.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="pagination">
              <Button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                variant="outline"
                className="btn-pagination"
              >
                Previous
              </Button>
              <span className="page-info">
                Page {page} of {totalPages}
              </span>
              <Button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                variant="outline"
                className="btn-pagination"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
