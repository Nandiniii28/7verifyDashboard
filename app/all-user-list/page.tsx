"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { HiOutlineDotsVertical } from "react-icons/hi";
import Link from "next/link";
import { FiUsers, FiMail, FiUserCheck, FiShield } from "react-icons/fi";
import { FaCalendarAlt } from "react-icons/fa";

const roles = ["All", "User", "Admin"];
const verification = ["All", "Verified", "Unverified"]; // Added "All" option
const services = ["Email API", "SMS Gateway", "User Auth", "Billing"];

export default function AllUserListPage() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const [filters, setFilters] = useState({
    email: "",
    role: "All",
    isVerified: "All", // Set default to "All"
    fromDate: "",
    toDate: "",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const query = {
        ...filters,
        role: filters.role === "All" ? "" : filters.role.toLowerCase(),
        isVerified: filters.isVerified === "All" ? "" : 
                   filters.isVerified === "Verified" ? "true" : "false",
        page,
        limit: 10,
      };
      const res = await axiosInstance.get("/admin/users", { params: query });
      setUsers(res.data.users);
      setTotalPages(Math.ceil(res.data.total / 10));
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters, page]);

  const handleAction = (type: string, userId: string) => {
    if (type === "verifyKYC") {
      toast.success(`KYC verified for user ${userId}`);
    } else if (type === "productionKey") {
      toast.success(`Production key generated`);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-blue-500 font-bold flex items-center gap-2">
          <FiUsers className="text-blue-600" />
          User Management
        </h2>

        <Button asChild>
          <Link href="/create-user">+ Create User</Link>
        </Button>
      </div>

      {/* Filters Section */}
      <div className="space-y-6 mb-6">
        {/* Top Row: Email, Role, Verification */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 min-w-0 space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <FiMail /> Email
            </label>
            <Input
              id="email"
              value={filters.email}
              onChange={(e) => setFilters({ ...filters, email: e.target.value })}
            />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <label htmlFor="role" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <FiUserCheck /> Role
            </label>
            <Select
              value={filters.role}
              onValueChange={(value) => setFilters({ ...filters, role: value })}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <label htmlFor="verification" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <FiShield /> Verification
            </label>
            <Select
              value={filters.isVerified}
              onValueChange={(value) => setFilters({ ...filters, isVerified: value })}
            >
              <SelectTrigger id="verification">
                <SelectValue placeholder="Select Verification" />
              </SelectTrigger>
              <SelectContent>
                {verification.map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bottom Row: From Date, To Date */}
        <div className="flex gap-4">
          <div className="flex-1 min-w-0 space-y-1">
            <label htmlFor="fromDate" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <FaCalendarAlt /> From Date
            </label>
            <Input
              id="fromDate"
              type="date"
              value={filters.fromDate}
              onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
            />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <label htmlFor="toDate" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <FaCalendarAlt /> To Date
            </label>
            <Input
              id="toDate"
              type="date"
              value={filters.toDate}
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-md overflow-auto">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No users found</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-blue-50 text-md text-blue-700 uppercase">
              <tr>
                <th className="px-6 py-3">User Name</th>
                <th className="px-6 py-3">Verified</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">User ID</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user: any, idx) => (
                <tr key={user._id} className="hover:bg-gray-200 transition-colors">
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${user.isVerified ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}
                    >
                      {user.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4 font-mono">{user._id.slice(-6)}</td>
                  <td className="px-6 py-4 relative">
                    <button
                      onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <HiOutlineDotsVertical />
                    </button>
                    {openIndex === idx && (
                      <div className="absolute right-0 mt-2 bg-white border shadow rounded z-10 w-44">
                        <button
                          onClick={() => handleAction("verifyKYC", user._id)}
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                          Verify KYC
                        </button>
                        <button
                          onClick={() => handleAction("productionKey", user._id)}
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                          Generate Key
                        </button>
                        <div className="border-t" />
                        <div className="text-xs px-4 py-2 text-gray-500">Assign Service</div>
                        {services.map((s) => (
                          <button
                            key={s}
                            onClick={() => toast.success(`${s} assigned`)}
                            className="block w-full px-4 py-1 text-left hover:bg-gray-50 text-sm"
                          >
                            {s}
                          </button>
                        ))}
                        <div className="border-t" />
                        <button
                          onClick={() => toast.info("Update user")}
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                          Update
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}