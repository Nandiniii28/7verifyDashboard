"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

export default function ServiceListPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form, setForm] = useState({ name: "", charge: "" });

  useEffect(() => {
    fetchServices();
  }, [search, page]);

  const fetchServices = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get("/admin/services", {
        params: { search, page, limit },
      });
      setServices(res.data.services);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setForm({ name: "", charge: "" });
    setEditingService(null);
    setIsDialogOpen(true);
  };

  const openEditModal = (service) => {
    setForm({ name: service.name, charge: service.charge });
    setEditingService(service);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingService) {
        await axiosInstance.put(`/admin/update-charge/${editingService._id}`, form);
        toast.success("Service updated");
      } else {
        await axiosInstance.post("/admin/add-services", form);
        toast.success("Service created");
      }
      fetchServices();
      setIsDialogOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await axiosInstance.delete(`/admin/services/${id}`);
      toast.success("Service deleted");
      fetchServices();
    } catch {
      toast.error("Failed to delete service");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold brandorange-text">⚙️ Service Management</h2>
          <Button onClick={openCreateModal} className="brandorange-bg-light brandorange-text hover:bg-[#f9c4ad]">Create New</Button>
        </div>

        <div className="mb-4 max-w-xs">
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No services found.</div>
        ) : (
          <div className="overflow-x-auto "  style={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          margin: '16px 0'
        }}>
            <table className="w-full text-sm text-left text-gray-600 border rounded-md">
              <thead className=" brandorange-bg-light brandorange-text uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Charge</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service._id} className="bg-white border-b hover:bg-gray-50 transition-all">
                    <td className="px-4 py-3">{service.name}</td>
                    <td className="px-4 py-3">₹{service.charge}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <Button size="sm" onClick={() => openEditModal(service)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(service._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && services.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="text-sm brandorange-bg-light brandorange-text"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
            <Button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="brandorange-bg-light brandorange-text text-sm"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit Service" : "Create Service"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Service name"
              />
            </div>
            <div>
              <Label>Charge</Label>
              <Input
                type="number"
                value={form.charge}
                onChange={(e) => setForm({ ...form, charge: e.target.value })}
                placeholder="Charge amount"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>
              {editingService ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
