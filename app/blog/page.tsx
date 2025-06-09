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

export default function AdminBlogManagementPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ title: "", content: "" });
    const [imageFile, setImageFile] = useState(null);
    console.log(imageFile);

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
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-blue-700">📝 Blog Management</h2>
                    <Button onClick={() => setDialogOpen(true)}>+ Create Blog</Button>
                </div>

                {loading ? (
                    <div className="text-center text-gray-500 py-8">Loading...</div>
                ) : blogs.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">No blogs found.</div>
                ) : (
                    <div className="overflow-x-auto border rounded-lg">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-blue-50 text-blue-700 text-xs uppercase">
                                <tr>
                                    <th className="px-4 py-3">Image</th>
                                    <th className="px-4 py-3">Title</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {blogs.map((blog) => (
                                    <tr key={blog._id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <img
                                                src={blog.mainImage || "/default-blog.jpg"}
                                                alt="blog-thumbnail"
                                                className="w-16 h-16 object-cover rounded-md border"
                                            />
                                        </td>
                                        <td className="px-4 py-3">{blog.title}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`font-medium ${blog.status ? "text-green-600" : "text-red-500"
                                                    }`}
                                            >
                                                {blog.status ? "Published" : "Unpublished"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleStatusToggle(blog._id)}
                                            >
                                                Toggle Status
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(blog._id)}
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

            {/* Create Blog Dialog */}
            <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Create New Blog</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <Input
                                type="text"
                                placeholder="Enter blog title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Content</label>
                            <Textarea
                                rows={5}
                                placeholder="Enter blog content"
                                value={formData.content}
                                onChange={(e) =>
                                    setFormData({ ...formData, content: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Main Image</label>
                            <Input
                                type="file"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button onClick={handleDialogClose} variant="outline">
                            Cancel
                        </Button>
                        <Button onClick={handleCreateBlog}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
