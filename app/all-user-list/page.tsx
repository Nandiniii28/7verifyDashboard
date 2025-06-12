"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useRouter } from 'next/navigation';
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
import { FiCheckCircle, FiKey, FiEdit2 } from 'react-icons/fi';

import { 
  FaSms, 
  FaUserLock, 
  FaMoneyBillWave,
  FaEnvelope,

} from "react-icons/fa";

const roles = ["All", "User", "Admin"];
const verification = ["All", "Verified", "Unverified"]; 
const services= {
  "Email API": <FaEnvelope className="mr-2 text-blue-500" />,
  "SMS Gateway": <FaSms className="mr-2 text-green-500" />,
  "User Auth": <FaUserLock className="mr-2 text-purple-500" />,
  "Billing": <FaMoneyBillWave className="mr-2 text-red-500" />
};

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
    const router = useRouter();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h5 className="text-2xl text-blue-500  flex items-center gap-2">
          <FiUsers className="text-blue-600" />
          User Management
        </h5>

        <Button asChild  className="text-blue-600" >
          <Link href="/create-user" className="text-white">+ Create User </Link>
        </Button>
      </div>

      {/* Filters Section */}
    <div className="space-y-6 mb-6">
  {/* Single Row with all filters */}
  <div className="flex gap-4 mb-4">
    <div className="flex-1 min-w-0 space-y-1">
      <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-1">
        Email
      </label>
      <Input
        id="email"
        value={filters.email}
        onChange={(e) => setFilters({ ...filters, email: e.target.value })}
      />
    </div>

    <div className="flex-1 min-w-0 space-y-1">
      <label htmlFor="role" className="text-sm font-medium text-gray-700 flex items-center gap-1">
        Role
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
        Verification
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

    <div className="flex-1 min-w-0 space-y-1">
      <label htmlFor="fromDate" className="text-sm font-medium text-gray-700 flex items-center gap-1">
        From Date
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
        To Date
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
    <div className="bg-white shadow rounded-md overflow-auto max-h-[500px]">
  <table className="w-full text-sm text-left border-separate border-spacing-y-1">
    <thead className="bg-blue-50 text-md text-blue-700 uppercase sticky top-0 z-10 shadow-sm">
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
        <tr
          key={user._id}
          className="bg-white hover:bg-gray-100 transition-colors"
        >
          <td className="px-6 py-4 font-medium">{user.name}</td>
          <td className="px-6 py-4">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                user.isVerified
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {user.isVerified ? "Verified" : "Unverified"}
            </span>
          </td>
          <td className="px-6 py-4">{user.email}</td>
          <td className="px-6 py-4 font-mono">{user._id.slice(-6)}</td>
          <td className="px-6 py-4 flex items-center space-x-2 relative">
            <button
              onClick={() => handleAction("verifyKYC", user._id)}
              className="p-2 hover:bg-gray-100 rounded text-green-600"
              title="Verify KYC"
            >
              <FiCheckCircle />
            </button>

            <button
              onClick={() => handleAction("productionKey", user._id)}
              className="p-2 hover:bg-gray-100 rounded text-blue-600"
              title="Generate Key"
            >
              <FiKey />
            </button>

            <Link
               href="/updatealluser"
              className="p-2 hover:bg-gray-100 rounded text-gray-600"
              title="Update"
            >
              <FiEdit2 />
            </Link>

            <div className="relative">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <HiOutlineDotsVertical />
              </button>
              {openIndex === idx && (
                <div className="absolute mt-2 bg-white border shadow-lg rounded z-10 w-48">
                  <div className="text-xs px-4 py-2 text-gray-500">Assign Service</div>
                {services?.map((s) => (
  <button
    key={s}
    onClick={() => toast.success(`${s} assigned`)}
    className="px-4 py-2 w-full text-left hover:bg-gray-50 text-sm flex items-center gap-2"
    aria-label={`Assign ${s}`}
  >
    {serviceIcons[s] && <span>{serviceIcons[s]}</span>}
    <span>{s}</span>
  </button>
                  ))}
                </div>
              )}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>


      
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