"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { FiMail, FiFilter, FiLoader, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";
import "./contant.css";

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
        <div className="contact-admin-container">
            <div className="contact-admin-card">
                <div className="contact-admin-header">
                    <div className="header-title">
                        <FiMail className="header-icon" />
                        <h2>Contact Requests</h2>
                    </div>
                    <div className="filter-control">
                        <FiFilter className="filter-icon" />
                        <select
                            className="filter-select"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="">All Messages</option>
                            <option value="true">Seen</option>
                            <option value="false">Unseen</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <FiLoader className="spinner-icon" />
                        <span>Loading contact requests...</span>
                    </div>
                ) : contacts.length === 0 ? (
                    <div className="empty-state">
                        <FiMail className="empty-icon" />
                        <span>No contact requests found</span>
                    </div>
                ) : (
                    <div className="contacts-table-container">
                        <table className="contacts-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Contact</th>
                                    <th>Message</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.map((c) => (
                                    <tr key={c._id} className={c.seen ? "seen-row" : "unseen-row"}>
                                        <td>{c.name}</td>
                                        <td>{c.email}</td>
                                        <td>{c.contact}</td>
                                        <td className="message-cell">{c.message}</td>
                                        <td>
                                            <span className={`status-badge ${c.seen ? "seen" : "unseen"}`}>
                                                {c.seen ? <FiEye /> : <FiEyeOff />}
                                                {c.seen ? "Seen" : "Unseen"}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            <button
                                                className="action-btn toggle-btn"
                                                onClick={() => toggleSeenStatus(c._id)}
                                            >
                                                Toggle Status
                                            </button>
                                            <button
                                                className="action-btn delete-btn"
                                                onClick={() => deleteContact(c._id)}
                                            >
                                                <FiTrash2 />
                                                Delete
                                            </button>
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