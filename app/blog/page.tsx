"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { FaBlog } from "react-icons/fa";

import "./blog.css"; // External CSS

export default function AdminBlogManagementPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ title: "", content: "" });
    const [imageFile, setImageFile] = useState(null);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/blog/read");
            setBlogs(res.data.allBlog || []);
        } catch {
            toast.error("Failed to load blogs.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (id) => {
        try {
            await axiosInstance.put(`/blog/status-change?id=${id}`);
            toast.success("Status updated.");
            fetchBlogs();
        } catch {
            toast.error("Failed to update status.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this blog?")) return;
        try {
            await axiosInstance.delete(`/blog/delete/${id}`);
            toast.success("Blog deleted.");
            fetchBlogs();
        } catch {
            toast.error("Delete failed.");
        }
    };

    const handleCreateBlog = async () => {
        if (!formData.title || !formData.content || !imageFile) {
            toast.error("All fields are required.");
            return;
        }

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("content", formData.content);
            data.append("mainImage", imageFile);

            const res = await axiosInstance.post("/blog/create", data);
            if (res.data.status === 1) {
                toast.success("Blog created.");
                setDialogOpen(false);
                setFormData({ title: "", content: "" });
                setImageFile(null);
                fetchBlogs();
            } else {
                toast.error(res.data.msg || "Creation failed.");
            }
        } catch {
            toast.error("Server error while creating blog.");
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setFormData({ title: "", content: "" });
        setImageFile(null);
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    return (
        <div className="admin-page-container">
            <div className="admin-box">
                <div className="admin-header">
                    <h2 className="admin-title">
                        <FaBlog className="icon" /> Blog Management
                    </h2>
                    <Button onClick={() => setDialogOpen(true)}>+ Create Blog</Button>
                </div>

                {loading ? (
                    <div className="admin-empty">Loading...</div>
                ) : blogs.length === 0 ? (
                    <div className="admin-empty">No blogs found.</div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogs.map((blog) => (
                                    <tr key={blog._id}>
                                        <td>
                                            <img
                                                src={blog.mainImage || "/default-blog.jpg"}
                                                alt="blog-thumbnail"
                                                className="thumbnail"
                                            />
                                        </td>
                                        <td>{blog.title}</td>
                                        <td>
                                            <span className={`status ${blog.status ? "published" : "unpublished"}`}>
                                                {blog.status ? "Published" : "Unpublished"}
                                            </span>
                                        </td>
                                        <td>
                                            <Button variant="outline" size="sm" onClick={() => handleStatusToggle(blog._id)}>
                                                Toggle Status
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(blog._id)}>
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

            {/* Create Blog Dialog */}
            <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
                <DialogContent className="dialog-normal">
                    <DialogHeader>
                        <DialogTitle>Create New Blog</DialogTitle>
                    </DialogHeader>

                    <div className="dialog-form">
                        <label>Title</label>
                        <Input
                            type="text"
                            placeholder="Enter blog title"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                        />

                        <label>Content</label>
                        <Textarea
                            rows={5}
                            placeholder="Enter blog content"
                            value={formData.content}
                            onChange={(e) =>
                                setFormData({ ...formData, content: e.target.value })
                            }
                        />

                        <label>Main Image</label>
                        <Input
                            type="file"
                            onChange={(e) =>
                                setImageFile(e.target.files?.[0] || null)
                            }
                        />
                    </div>

                    <DialogFooter className="dialog-footer">
                        <Button onClick={handleDialogClose} variant="outline">Cancel</Button>
                        <Button onClick={handleCreateBlog}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
