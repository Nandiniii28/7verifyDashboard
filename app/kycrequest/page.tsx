// "use client";

// import { useEffect, useState } from "react";
// import axiosInstance from "@/components/service/axiosInstance";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//     Select,
//     SelectTrigger,
//     SelectValue,
//     SelectContent,
//     SelectItem,
// } from "@/components/ui/select";
// import { toast } from "react-toastify";
// import { FiUserCheck } from "react-icons/fi";
// // React icons import
// import { FiSearch, FiUser, FiCalendar, FiArrowUp, FiArrowDown } from "react-icons/fi";

// // Import external CSS for filters form
// import "./kycrequest.css";

// export default function KycRequestPage() {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [filters, setFilters] = useState({
//         search: "",
//         role: "all",
//         startDate: "",
//         endDate: "",
//         sortBy: "createdAt",
//         sortOrder: "desc",
//     });
//     const [page, setPage] = useState(1);
//     const [limit] = useState(10);
//     const [totalPages, setTotalPages] = useState(1);

//     useEffect(() => {
//         fetchKycRequests();
//     }, [filters, page]);

//     const handleAction = async (isVerified, userId) => {
//         try {
//             setLoading(true);
//             const res = await axiosInstance.post("/admin/verify-kyc", {
//                 userId,
//                 isVerified,
//             });
//             setUsers(res.data.data);
//             setTotalPages(res.data.totalPages);
//         } catch (err) {
//             toast.error("Failed to load KYC requests.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchKycRequests = async () => {
//         try {
//             setLoading(true);
//             const res = await axiosInstance.get("/admin/kyc-request", {
//                 params: {
//                     ...filters,
//                     role: filters.role === "all" ? "" : filters.role,
//                     page,
//                     limit,
//                 },
//             });
//             setUsers(res.data.data);
//             setTotalPages(res.data.totalPages);
//         } catch (err) {
//             toast.error("Failed to load KYC requests.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen p-6 bg-gray-50">
//             <div className="mb-2 flex items-center gap-2">
//                 <FiUserCheck style={{ fontSize: "30px", color: "#2563eb" }} />
//                 <h1 style={{ color: "#2563eb" }} className="text-2xl font-bold">
//                     KYC Requests
//                 </h1>
//             </div>


//             {/* Filters form with icons and layout */}
//             <div className="filters">
//                 {/* Full row - search input */}
//                 <div className="filter-item full-row">
//                     <label htmlFor="search">
//                         <FiSearch className="icon" /> Name or Email
//                     </label>
//                     <Input
//                         id="search"
//                         placeholder="Search name or email"
//                         value={filters.search}
//                         onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//                     />
//                 </div>

//                 {/* Half row - Role and Sort Order */}
//                 <div className="filter-row">
//                     <div className="filter-item half-row">
//                         <label htmlFor="role">
//                             <FiUser className="icon" /> Role
//                         </label>
//                         <Select
//                             id="role"
//                             value={filters.role}
//                             onValueChange={(value) => setFilters({ ...filters, role: value })}
//                         >
//                             <SelectTrigger>
//                                 <SelectValue placeholder="Select Role" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="all">All</SelectItem>
//                                 <SelectItem value="user">User</SelectItem>
//                                 <SelectItem value="admin">Admin</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div className="filter-item half-row">
//                         <label htmlFor="sortOrder">
//                             <FiArrowUp className="icon" />
//                             <FiArrowDown className="icon" /> Sort Order
//                         </label>
//                         <Select
//                             id="sortOrder"
//                             value={filters.sortOrder}
//                             onValueChange={(value) => setFilters({ ...filters, sortOrder: value })}
//                         >
//                             <SelectTrigger>
//                                 <SelectValue placeholder="Sort Order" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="desc">Newest First</SelectItem>
//                                 <SelectItem value="asc">Oldest First</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>
//                 </div>

//                 {/* Half row - Start Date and End Date */}
//                 <div className="filter-row">
//                     <div className="filter-item half-row">
//                         <label htmlFor="startDate">
//                             <FiCalendar className="icon" /> Start Date
//                         </label>
//                         <Input
//                             type="date"
//                             id="startDate"
//                             value={filters.startDate}
//                             onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
//                         />
//                     </div>

//                     <div className="filter-item half-row">
//                         <label htmlFor="endDate">
//                             <FiCalendar className="icon" /> End Date
//                         </label>
//                         <Input
//                             type="date"
//                             id="endDate"
//                             value={filters.endDate}
//                             onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* Table */}
//             <div className="bg-white shadow rounded overflow-x-auto">
//                 {loading ? (
//                     <div className="text-center py-6">Loading...</div>
//                 ) : users?.length === 0 ? (
//                     <div className="text-center py-6 text-gray-500">No KYC requests found.</div>
//                 ) : (
//                     <table className="min-w-full divide-y divide-gray-200 text-sm">
//                         <thead className="bg-gray-100">
//                             <tr>
//                                 <th className="px-6 py-3 text-left font-medium">Name</th>
//                                 <th className="px-6 py-3 text-left font-medium">Email</th>
//                                 <th className="px-6 py-3 text-left font-medium">Role</th>
//                                 <th className="px-6 py-3 text-left font-medium">Date</th>
//                                 <th className="px-6 py-3 text-left font-medium">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                             {users?.map((user) => (
//                                 <tr key={user._id}>
//                                     <td className="px-6 py-4">{user.name}</td>
//                                     <td className="px-6 py-4">{user.email}</td>
//                                     <td className="px-6 py-4 capitalize">{user.role}</td>
//                                     <td className="px-6 py-4">
//                                         {new Date(user.createdAt).toLocaleDateString()}
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <div className="flex gap-2">
//                                             <Button variant="default" onClick={() => handleAction(true, user._id)}>
//                                                 Approve
//                                             </Button>
//                                             <Button variant="destructive" onClick={() => handleAction(false, user._id)}>
//                                                 Reject
//                                             </Button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>

//             {/* Pagination */}
//             <div className="flex justify-between items-center mt-6">
//                 <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
//                     Previous
//                 </Button>
//                 <span className="text-sm text-gray-600">
//                     Page {page} of {totalPages}
//                 </span>
//                 <Button variant="outline" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
//                     Next
//                 </Button>
//             </div>
//         </div>
//     );
// }



"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoPasskeyFill } from "react-icons/go";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { FiUserCheck, FiSearch, FiUser, FiCalendar, FiArrowUp, FiArrowDown, FiRefreshCw } from "react-icons/fi";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function KycRequestPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);
    const [filters, setFilters] = useState({
        search: "",
        role: "all",
        startDate: "",
        endDate: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    });
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchKycRequests();
    }, [filters, page]);

    const handleAction = async (isVerified, userId) => {
        try {
            setActionLoading(userId);
            const res = await axiosInstance.post("/admin/verify-kyc", {
                userId,
                isVerified,
            });
            toast.success(`KYC ${isVerified ? 'approved' : 'rejected'} successfully`);
            fetchKycRequests();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to process KYC request");
        } finally {
            setActionLoading(null);
        }
    };

    const fetchKycRequests = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/admin/kyc-request", {
                params: {
                    ...filters,
                    role: filters.role === "all" ? "" : filters.role,
                    page,
                    limit,
                },
            });
            setUsers(res.data.data);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            toast.error("Failed to load KYC requests.");
        } finally {
            setLoading(false);
        }
    };

    const resetFilters = () => {
        setFilters({
            search: "",
            role: "all",
            startDate: "",
            endDate: "",
            sortBy: "createdAt",
            sortOrder: "desc",
        });
        setPage(1);
    };

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            {/* Header with refresh button */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <GoPasskeyFill className="text-blue-600 text-3xl mr-1" />
                    <h1 className="text-2xl font-bold text-blue-600">KYC Requests</h1>
                </div>

            </div>

            {/* Filters card */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            Search
                        </label>
                        <Input
                            placeholder="Name or email"
                            value={filters.search}
                            onChange={(e) => {
                                setPage(1);
                                setFilters({ ...filters, search: e.target.value });
                            }}
                        />
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            Role
                        </label>
                        <Select
                            value={filters.role}
                            onValueChange={(value) => {
                                setPage(1);
                                setFilters({ ...filters, role: value });
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date Range */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            Start Date
                        </label>
                        <Input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => {
                                setPage(1);
                                setFilters({ ...filters, startDate: e.target.value });
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            End Date
                        </label>
                        <Input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => {
                                setPage(1);
                                setFilters({ ...filters, endDate: e.target.value });
                            }}
                            min={filters.startDate}
                        />
                    </div>

                     <div className="filter-item half-row">
                        <label htmlFor="sortOrder">

                            Sort Order   </label>
                        <Select
                            id="sortOrder"
                            value={filters.sortOrder}
                            onValueChange={(value) => setFilters({ ...filters, sortOrder: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sort Order" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Newest First</SelectItem>
                                <SelectItem value="asc">Oldest First</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>



                </div>

                {/* <div className="flex justify-end mt-4 gap-2">
                    <div className="filter-item half-row">
                        <label htmlFor="sortOrder">

                            Sort Order   </label>
                        <Select
                            id="sortOrder"
                            value={filters.sortOrder}
                            onValueChange={(value) => setFilters({ ...filters, sortOrder: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sort Order" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Newest First</SelectItem>
                                <SelectItem value="asc">Oldest First</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div> */}
            </div>



            {/* Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                {loading ? (
                    <div className="p-6 space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                        ))}
                    </div>
                ) : users?.length === 0 ? (
                    <div className="text-center py-12">
                        <FiUserCheck className="mx-auto text-4xl text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No KYC requests found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your filters or check back later</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users?.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <FiUser className="text-blue-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 capitalize">{user.role}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={user.kycStatus === 'approved' ? 'default' : user.kycStatus === 'pending' ? 'secondary' : 'destructive'}>
                                                {user.kycStatus || 'pending'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAction(true, user._id)}
                                                    disabled={actionLoading === user._id}
                                                >
                                                    {actionLoading === user._id ? 'Processing...' : 'Approve'}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleAction(false, user._id)}
                                                    disabled={actionLoading === user._id}
                                                >
                                                    {actionLoading === user._id ? 'Processing...' : 'Reject'}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                <div className="text-sm text-gray-600">
                    Showing page {page} of {totalPages} • {users?.length} results
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                        disabled={page === 1 || loading}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages || loading}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}