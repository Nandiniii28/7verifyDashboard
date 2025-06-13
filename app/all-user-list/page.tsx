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
import { FiUsers, FiCheckCircle, FiKey, FiEdit2 } from "react-icons/fi";
import {
  FaSms,
  FaUserLock,
  FaMoneyBillWave,
  FaEnvelope,
} from "react-icons/fa";

const roles = ["All", "User", "Admin"];
const verification = ["All", "Verified", "Unverified"];
const services = ["Email API", "SMS Gateway", "User Auth", "Billing"];
const serviceIcons = {
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
    isVerified: "All",
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
    <div className="space-y-6">
      <div className="p-6 mb-6 bg-white shadow rounded-md overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 style={{ fontSize: '20px', color: '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiUsers style={{ color: '#000000' }} />
            User Management
          </h1>
          <Link
            href="/create-user"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              padding: '8px 16px',
              backgroundColor: 'rgba(105, 108, 255, 0.16)',
              color: '#696cff',
              
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
            }}
            className="hover:bg-[rgba(105, 108, 255, 0.24)]"
          >
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              + Create User
            </span>
          </Link>
        </div>

        {/* Filters Section */}
        <div className="space-y-6 mb-6">
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
      </div>

      <div className=" mb-5 bg-white shadow rounded-md overflow-auto">
        {/* Table */}
        <div className="bg-white  rounded-md overflow-auto max-h-[500px]">
          <table className="w-full borderBottom: '1px solid #e5e7eb text-sm text-left border-separate border-spacing-y-1">
            <thead className="bg-blue-50 text-md text-blue-700 uppercase sticky top-0 z-10 ">
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
  style={{ borderBottom: '1px solid #e5e7eb' }}
>
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${user.isVerified
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
                        <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded z-10 w-48">
                          <div className="text-xs px-4 py-2 text-gray-500">Assign Service</div>
                          {services.map((s) => (
                            <button
                              key={s}
                              onClick={() => toast.success(`${s} assigned`)}
                              className="px-4 py-2 w-full text-left hover:bg-gray-50 text-sm flex items-center gap-2"
                              aria-label={`Assign ${s}`}
                            >
                              {serviceIcons[s]}
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
     <div style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '0px 10px'
}}>
  <button
    style={{
      backgroundColor: 'transparent',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      padding: '8px 16px',
      cursor: page <= 1 ? 'not-allowed' : 'pointer',
      opacity: page <= 1 ? 0.5 : 1,
      color: '#334155',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      ':hover': {
        backgroundColor: page <= 1 ? 'transparent' : '#f1f5f9',
        borderColor: page <= 1 ? '#e2e8f0' : '#cbd5e1'
      }
    }}
    disabled={page <= 1}
    onClick={() => setPage(page - 1)}
  >
    Previous
  </button>

  <span style={{
    fontSize: '14px',
    color: '#4b5563',
    padding: '24px',
    margin: '16px'
  }}>
    Page {page} of {totalPages}
  </span>

  <button
    style={{
      backgroundColor: 'transparent',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      padding: '8px 16px',
      cursor: page >= totalPages ? 'not-allowed' : 'pointer',
      opacity: page >= totalPages ? 0.5 : 1,
      color: '#334155',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
    hover: {
        backgroundColor: page >= totalPages ? 'transparent' : '#f1f5f9',
        borderColor: page >= totalPages ? '#e2e8f0' : '#cbd5e1'
      }
    }}
    disabled={page >= totalPages}
    onClick={() => setPage(page + 1)}
  >
    Next
  </button>
</div>
      </div>
    </div>
  );
}