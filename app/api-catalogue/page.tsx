"use client";

import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MainContext } from "../context/context";
import axiosInstance from "@/components/service/axiosInstance";
import { FaTrash, FaEdit, FaPlus, FaMinus } from "react-icons/fa";
import "./style.css";

export default function APICataloguePage() {
  const { tostymsg, allService, services } = useContext(MainContext);
  const { admin } = useSelector((state) => state.admin);
  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formFields, setFormFields] = useState([
    {
      name: "",
      charge: "",
      active_charge: "",
      description: "",
      endpoint: "",
      method: "POST",
      fields: [{ label: "", name: "", type: "text", required: true }],
    },
  ]);

  useEffect(() => {
    allService();
  }, []);

  const handleChange = (index, e) => {
    const updated = [...formFields];
    updated[index][e.target.name] =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormFields(updated);
  };

  const handleFieldChange = (formIndex, fieldIndex, e) => {
    const updated = [...formFields];
    updated[formIndex].fields[fieldIndex][e.target.name] =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormFields(updated);
  };

  const addField = () => {
    setFormFields([
      ...formFields,
      {
        name: "",
        charge: "",
        active_charge: "",
        description: "",
        endpoint: "",
        method: "POST",
        fields: [{ label: "", name: "", type: "text", required: true }],
      },
    ]);
  };

  const removeField = (index) => {
    const updated = [...formFields];
    updated.splice(index, 1);
    setFormFields(updated);
  };

  const addInputField = (index) => {
    const updated = [...formFields];
    updated[index].fields.push({
      label: "",
      name: "",
      type: "text",
      required: true,
    });
    setFormFields(updated);
  };

  const removeInputField = (formIndex, fieldIndex) => {
    const updated = [...formFields];
    updated[formIndex].fields.splice(fieldIndex, 1);
    setFormFields(updated);
  };

  const openEditModal = (api) => {
    setShowEdit(true);
    setShowModal(true);
    setEditId(api._id);
    setFormFields([
      {
        name: api.name,
        charge: api.charge,
        active_charge: api.active_charge,
        description: api.description,
        endpoint: api.endpoint,
        method: api.method,
        fields: api.fields || [],
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (showEdit) {
        const data = formFields[0];
        const res = await axiosInstance.put(`/admin/update-service/${editId}`, data);
        tostymsg(res.data.message, 1);
      } else {
        const res = await axiosInstance.post("/admin/add-multiple-services", {
          services: formFields,
        });
        tostymsg(res.data.message, 1);
      }
      setShowModal(false);
      setShowEdit(false);
      resetForm();
      allService();
    } catch (error) {
      tostymsg(error.response?.data?.message || "Something went wrong", 0);
    }
  };

  const resetForm = () => {
    setFormFields([
      {
        name: "",
        charge: "",
        active_charge: "",
        description: "",
        endpoint: "",
        method: "POST",
        fields: [{ label: "", name: "", type: "text", required: true }],
      },
    ]);
  };

  const getMethodClass = (method) => {
    if (method === "GET") return "bg-green-100 text-green-800";
    if (method === "POST") return "bg-blue-100 text-blue-800";
    if (method === "PUT") return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const getStatusClass = (status) => {
    if (status === "Active") return "bg-green-100 text-green-800";
    if (status === "Beta") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="bg-white rounded-lg shadow mx-4">
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Available APIs</h2>
        {admin?.role === "admin" && (
          <button
            onClick={() => {
              setShowEdit(false);
              resetForm();
              setShowModal(true);
            }}
            className="mt-3 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add New API
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              {["API Name", "Method", "Endpoint", "Status", "Version", "Actions"].map((title) => (
                <th key={title} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.length > 0 ? (
              services.map((api, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{api.name}</div>
                    <div className="text-sm text-gray-500">{api.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMethodClass(api.method)}`}>
                      {api.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">{api.endpoint}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(api.status)}`}>
                      {api.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{api.version}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-3 text-sm font-medium">
                    <button onClick={() => openEditModal(api)} className="text-blue-600 hover:text-blue-900">
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  No API services found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="absolute inset-0" onClick={() => setShowModal(false)}></div>
          <div className="relative z-10 bg-white max-w-2xl p-6 rounded-lg shadow-xl w-full overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{showEdit ? "Edit API" : "Create API(s)"}</h3>
              <button onClick={() => setShowModal(false)}>❌</button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {formFields.map((field, index) => (
                <div key={index} className="space-y-2 border-b pb-4">
                  <input type="text" name="name" placeholder="API Name" value={field.name} onChange={(e) => handleChange(index, e)} required className="w-full p-2 border rounded" />
                  <input type="number" name="charge" placeholder="Charge" value={field.charge} onChange={(e) => handleChange(index, e)} required className="w-full p-2 border rounded" />
                  <input type="number" name="active_charge" placeholder="Active Charge" value={field.active_charge} onChange={(e) => handleChange(index, e)} required className="w-full p-2 border rounded" />
                  <textarea name="description" placeholder="Description" value={field.description} onChange={(e) => handleChange(index, e)} rows={2} className="w-full p-2 border rounded" />
                  <input type="text" name="endpoint" placeholder="/api/endpoint" value={field.endpoint} onChange={(e) => handleChange(index, e)} required className="w-full p-2 border rounded" />
                  <select name="method" value={field.method} onChange={(e) => handleChange(index, e)} className="w-full p-2 border rounded">
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>

                  <div className="mt-4">
                    <h4 className="font-medium">Fields:</h4>
                    {field.fields.map((f, i) => (
                      <div key={i} className="grid grid-cols-2 gap-2 mb-2">
                        <input type="text" name="label" placeholder="Label" value={f.label} onChange={(e) => handleFieldChange(index, i, e)} className="p-2 border rounded" />
                        <input type="text" name="name" placeholder="Field Name" value={f.name} onChange={(e) => handleFieldChange(index, i, e)} className="p-2 border rounded" />
                        <select name="type" value={f.type} onChange={(e) => handleFieldChange(index, i, e)} className="col-span-1 p-2 border rounded">
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="file">File</option>
                        </select>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" name="required" checked={f.required} onChange={(e) => handleFieldChange(index, i, e)} />
                          Required
                        </label>
                        {field.fields.length > 1 && (
                          <button type="button" onClick={() => removeInputField(index, i)} className="col-span-2 text-red-600 text-sm flex items-center gap-1">
                            <FaMinus /> Remove Field
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => addInputField(index)} className="text-blue-600 text-sm flex items-center gap-1 mt-2">
                      <FaPlus /> Add Input Field
                    </button>
                  </div>

                  {!showEdit && formFields.length > 1 && (
                    <button type="button" onClick={() => removeField(index)} className="text-sm text-red-600 hover:underline mt-2 flex items-center gap-1">
                      <FaMinus /> Remove API
                    </button>
                  )}
                </div>
              ))}

              {!showEdit && (
                <button type="button" onClick={addField} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                  <FaPlus /> Add Another API
                </button>
              )}

              <div className="flex justify-end mt-4 gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  {showEdit ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
