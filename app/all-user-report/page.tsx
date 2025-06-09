"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { FiBarChart2 } from "react-icons/fi";

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
    <div className="page-container">
      <div className="card">
        <div className="header-row">
          <h2 className="title">
            <FiBarChart2 className="icon" size={28} />
            All User Report
          </h2>
          <div className="controls">
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
            <Button
              variant="outline"
              onClick={() => handleExport("csv")}
              className="btn-export btn-csv"
            >
              Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport("excel")}
              className="btn-export btn-excel"
            >
              Export Excel
            </Button>
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
  );
}
