"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function ServiceListPage() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form, setForm] = useState({
    name: "",
    charge: "",
    active_charge: "",
    description: "",
  });

  useEffect(() => {
    fetchServices();
  }, [search, page]);

  const fetchServices = async () => {
    try {
      const res = await axiosInstance.get("/admin/services", {
        params: { search, page, limit },
      });
      setServices(res.data.services);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };

  const openCreateModal = () => {
    setForm({ name: "", charge: "", active_charge: "", description: "" });
    setEditingService(null);
    setIsDialogOpen(true);
  };

  const openEditModal = (service) => {
    setForm({
      name: service.name,
      charge: service.charge,
      active_charge: service.active_charge,
      description: service.description,
    });
    setEditingService(service);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingService) {
        await axiosInstance.put(`/admin/update-charge/${editingService._id}`, form);
        toast.success("Service updated successfully");
      } else {
        await axiosInstance.post("/admin/add-services", form);
        toast.success("Service created successfully");
      }
      fetchServices();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await axiosInstance.delete(`/admin/services/${id}`);
      toast.success("Service deleted");
      fetchServices();
    } catch (error) {
      toast.error("Failed to delete service");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-700">📦 Service Management</h2>
          <Button onClick={openCreateModal}>+ Create Service</Button>
        </div>

        {/* Search */}
        <div className="mb-4 max-w-xs">
          <Input
            placeholder="🔍 Search service..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700 border rounded-md">
            <thead className="bg-blue-50 text-blue-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Charge (₹)</th>
                <th className="px-4 py-3">Active Charge (₹)</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                    No services found.
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr
                    key={service._id}
                    className="bg-white border-b hover:bg-gray-50 transition-all"
                  >
                    <td className="px-4 py-3">{service.name}</td>
                    <td className="px-4 py-3">₹{service.charge}</td>
                    <td className="px-4 py-3">₹{service?.active_charge}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {service?.descreption}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <Button size="sm" onClick={() => openEditModal(service)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(service._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
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
                placeholder="Total charge"
              />
            </div>
            <div>
              <Label>Active Charge</Label>
              <Input
                type="number"
                value={form.active_charge}
                onChange={(e) =>
                  setForm({ ...form, active_charge: e.target.value })
                }
                placeholder="Active charge"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>{editingService ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
