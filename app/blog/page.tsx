"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { Button } from "@/components/ui/button";
import { GrBlog } from "react-icons/gr";
import { RiBloggerLine } from "react-icons/ri";

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
            <div className="admin-box m">
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
                    <div className=" md:flex  justify-between items-center">
                        <h1 className="flex" style={{ fontSize: '20px', color: '#000000', display: 'flex', alignItems: 'center' , justifyContent:'center', gap: '8px' }}>
                            <RiBloggerLine className="fs-4"/>
                            Blog Management
                        </h1>
                        <div className="flex justify-center mt-2 md:mt-0"> <button
                            onClick={() => setDialogOpen(true)}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium brandorange-bg-light brandorange-text hover:bg-[#f9c4ad] cursor-pointer rounded"
                        >
                            + Create Blog
                        </button></div>



                    </div>
                </div>

                {loading ? (
                    <div className="admin-empty">Loading...</div>
                ) : blogs.length === 0 ? (
                    <div className="admin-empty">No blogs found.</div>
                ) : (
                    <div className="admin-table-wrapper mt-3 p-3 bg-white">
                        <table className="admin-table">
                            <thead className="brandorange-bg-light brandorange-text">
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
                                            <Button variant="outline" size="sm" onClick={() => handleStatusToggle(blog._id)} className="mr-2 mb-1 md:mb-0">
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
                    <DialogHeader className="new">
                        <DialogTitle className="flex items-center space-x-2">
                            <h5 className="admin-title">
                                <RiBloggerLine />
                                Blog Management
                            </h5>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="dialog-form grid gap-4">

                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">

                            <div className="grid gap-2">
                                <label htmlFor="title">Title</label>
                                <Input
                                    id="title"
                                    type="text"
                                    placeholder="Enter blog title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>


                            <div className="grid gap-2">
                                <label htmlFor="image">Main Image</label>
                                <Input
                                    id="image"
                                    type="file"
                                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                />
                            </div>
                        </div>


                        <div className="grid gap-2">
                            <label htmlFor="content">Content</label>
                            <Textarea
                                id="content"
                                rows={1}
                                placeholder="Enter blog content"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            />
                        </div>
                    </div>

                    <DialogFooter className="dialog-footer">
                        <Button onClick={handleDialogClose} variant="outline">Cancel</Button>
                        <Button onClick={handleCreateBlog} className="brandorange-bg-light brandorange-text  hover:bg-[#f9c4ad]">Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}