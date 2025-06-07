"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-blue-700">📊 All User Report</h2>
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Search name/email"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="w-[200px]"
            />
            <Input
              placeholder="Filter by service"
              value={serviceFilter}
              onChange={(e) => {
                setPage(1);
                setServiceFilter(e.target.value);
              }}
              className="w-[200px]"
            />
            <Button variant="outline" onClick={() => handleExport("csv")}>
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport("excel")}>
              Export Excel
            </Button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="text-red-600 bg-red-100 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          {loading ? (
            <div className="text-center p-8 text-gray-500">Loading...</div>
          ) : users.length === 0 ? (
            <div className="text-center p-8 text-gray-500">No users found.</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-blue-50 text-blue-700 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Hit Count</th>
                  <th className="px-4 py-3">Total Charges</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {users.map((user) =>
                  user.serviceUsage.map((service, index) => (
                    <tr
                      key={`${user._id}-${index}`}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3">{service.service}</td>
                      <td className="px-4 py-3 text-green-700 font-medium">{service.hitCount}</td>
                      <td className="px-4 py-3 text-gray-800">
                        ₹ {service.totalCharge?.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <Button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              variant="outline"
            >
              Previous
            </Button>
            <span className="text-gray-600 text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              variant="outline"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
