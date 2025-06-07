"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import { HiOutlineDotsVertical } from "react-icons/hi";
import Link from "next/link";

const roles = ["user", "admin", "all"];
const verification = ["all", "true", "false"];
const services = ["Email API", "SMS Gateway", "User Auth", "Billing"];

export default function AllUserListPage() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const [filters, setFilters] = useState({
    email: "",
    role: "all",
    isVerified: "all",
    fromDate: "",
    toDate: ""
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const query = {
        ...filters,
        role: filters.role === "all" ? "" : filters.role,
        isVerified: filters.isVerified === "all" ? "" : filters.isVerified,
        page,
        limit: 10
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button asChild>
          <Link href="/create-user">+ Create User</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Input
          placeholder="Search by email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        />
        <Select value={filters.role} onValueChange={(value) => setFilters({ ...filters, role: value })}>
          <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
          <SelectContent>
            {roles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.isVerified} onValueChange={(value) => setFilters({ ...filters, isVerified: value })}>
          <SelectTrigger><SelectValue placeholder="Verification" /></SelectTrigger>
          <SelectContent>
            {verification.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={filters.fromDate}
          onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
        />
        <Input
          type="date"
          value={filters.toDate}
          onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-md overflow-auto">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No users found</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
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
                <tr key={user._id}>
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${user.isVerified ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
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
                        <button onClick={() => handleAction("verifyKYC", user._id)} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                          Verify KYC
                        </button>
                        <button onClick={() => handleAction("productionKey", user._id)} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                          Generate Key
                        </button>
                        <div className="border-t" />
                        <div className="text-xs px-4 py-2 text-gray-500">Assign Service</div>
                        {services.map((s) => (
                          <button key={s} onClick={() => toast.success(`${s} assigned`)} className="block w-full px-4 py-1 text-left hover:bg-gray-50 text-sm">
                            {s}
                          </button>
                        ))}
                        <div className="border-t" />
                        <button onClick={() => toast.info("Update user")} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
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
        <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
        <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
      </div>
    </div>
  );
}
