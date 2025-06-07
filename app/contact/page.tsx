"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function ContactAdminPage() {
    const [contacts, setContacts] = useState([]);
    const [filter, setFilter] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/contact/read", {
                params: { filter },
            });
            setContacts(res.data.contact || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load contact requests.");
        } finally {
            setLoading(false);
        }
    };
    console.log(setContacts);

    const toggleSeenStatus = async (id) => {

        try {
            const res = await axiosInstance.patch(`/contact/status-change?id=${id}`);
            
            toast.success("Status updated");
            fetchContacts();
        } catch {
            toast.error("Failed to change status.");
        }
    };

    const deleteContact = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            await axiosInstance.delete("/contact/delete", { params: { id } });
            toast.success("Message deleted");
            fetchContacts();
        } catch {
            toast.error("Delete failed.");
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [filter]);

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gray-50">
            <div className="bg-white shadow-md rounded-2xl p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <h2 className="text-xl font-semibold text-blue-700">📬 Contact Requests</h2>
                    <select
                        className="border p-2 rounded-md"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="true">Seen</option>
                        <option value="false">Unseen</option>
                    </select>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading...</div>
                ) : contacts.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No contact requests found.</div>
                ) : (
                    <div className="overflow-x-auto border rounded-lg">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-blue-50 text-blue-700 text-xs uppercase">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Contact</th>
                                    <th className="px-4 py-3">Message</th>
                                    <th className="px-4 py-3">Seen</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {contacts.map((c) => (
                                    <tr key={c._id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-3">{c.name}</td>
                                        <td className="px-4 py-3 text-gray-600">{c.email}</td>
                                        <td className="px-4 py-3">{c.contact}</td>
                                        <td className="px-4 py-3 max-w-xs whitespace-pre-wrap">{c.message}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-sm font-medium ${c.seen ? "text-green-600" : "text-red-500"}`}>
                                                {c.seen ? "Seen" : "Unseen"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => toggleSeenStatus(c._id)}
                                            >
                                                Toggle Seen
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => deleteContact(c._id)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
