"use client";

import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MainContext } from "../context/context";
import axiosInstance from "@/components/service/axiosInstance";
import {  FaEdit, FaPlus, FaMinus, FaServer } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

import "./style.css";

export default function APICataloguePage() {
  const { tostymsg, allService, services, totalPages } = useContext(MainContext);
  const { admin } = useSelector((state) => state.admin);
  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [minCharge, setMinCharge] = useState("");
  const [maxCharge, setMaxCharge] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [formFields, setFormFields] = useState([
    {
      name: "",
      charge: "",
      active_charge: "",
      descreption: "",
      endpoint: "",
      method: "POST",
      fields: [{ label: "", name: "", type: "text", required: true }],
    },
  ]);

  useEffect(() => {
    allService(page, limit, search, methodFilter, minCharge, maxCharge, activeOnly);
  }, [page, page, limit, search, methodFilter, minCharge, maxCharge, activeOnly]);


  const handleChange = (index, e) => {
    const updated = [...formFields];
    updated[index][e.target.name] =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormFields(updated);
  };

  const handleFieldChange = (
    formIndex: number,
    fieldIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updated = [...formFields];
    const field = updated[formIndex].fields[fieldIndex];
    const { name, type, checked, value } = e.target;
    if (field && typeof field === "object" && name in field) {
      (field as any)[name] = type === "checkbox" ? checked : value;
    }
    setFormFields(updated);
  };

  const addField = () => {
    setFormFields([
      ...formFields,
      {
        name: "",
        charge: "",
        active_charge: "",
        descreption: "",
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
        descreption: api.descreption,
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
        const res = await axiosInstance.post("/admin/add-services", {
          services: formFields[0],
        });

        tostymsg(res.data.message, 1);

      }
      setShowModal(false);
      setShowEdit(false);
      resetForm();
      allService(page, limit, search, methodFilter, minCharge, maxCharge, activeOnly);
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
        descreption: "",
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
    <div className="p-6 font-sans bg-gray-50 min-h-screen">
      <div className="p-6 mb-6 bg-white shadow rounded-md overflow-auto">
        {/* Header */}
        <div className="md:flex justify-between text-black-600 mb-6">

          <div style={{ alignItems: 'center', gap: '8px' }} className="flex">
            <FaServer style={{
              color: 'black',
              fontSize: '20px',
              marginRight: '8px'
            }} />
            <h2 className="text-2xl">API Catalogue</h2>
          </div>
          {admin?.role === "admin" && (
            <div className="flex justify-center mt-2 md:mt-0 md:block  " >
              <button
                onClick={() => {
                  setShowEdit(false);
                  resetForm();
                  setShowModal(true);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  borderRadius: '6px',
               padding: '8px 12px',
                  fontSize: '14px',
                  fontWeight: 500,
               boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  cursor: 'pointer',
                  border: 'none',
                  outline: 'none',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9c4ad'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fde8df'}
                className="brandorange-bg-light brandorange-text"
              >
                <FaPlus className="mr-2" />
                Add New API
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div style={{ alignItems: 'center', gap: '16px', marginBottom: '16px', width: '100%' }} className="md:flex " >
          <div style={{ position: 'relative', flex: 1 }} className="py-1">
            <FaSearch style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9CA3AF'
            }} />
            <input
              type="text"
              placeholder="Search by API name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '8px 12px 8px 36px',
                borderRadius: '6px',
                border: '1px solid #D1D5DB',
                width: '100%',
                fontSize: '14px'
              }}
            />
          </div>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #D1D5DB',
              fontSize: '14px',
              flex: 1
            }}
            className="py-1"
          >
            <option value="">All Methods</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>

          <div style={{  gap: '8px', flex: 1 }} className="py-1 md:flex">
            <input
              type="number"
              placeholder="Min Charge"
              value={minCharge}
              onChange={(e) => setMinCharge(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #D1D5DB',
                fontSize: '14px',
                width: '100%'
              }}
              className="my-1"
            />
            <input
              type="number"
              placeholder="Max Charge"
              value={maxCharge}
              onChange={(e) => setMaxCharge(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #D1D5DB',
                fontSize: '14px',
                width: '100%'
              }}
              className="py-1"
            />
          </div>

          {/* <button
        onClick={() => allService(page, limit, search, methodFilter, minCharge, maxCharge, activeOnly)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          borderRadius: '6px',
          backgroundColor: '#2563eb',
          padding: '8px 12px',
          fontSize: '14px',
          fontWeight: 500,
          color: 'white',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          cursor: 'pointer',
          border: 'none',
          outline: 'none',
          transition: 'background-color 0.2s',
          flex: 0.5
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
      >
        Apply Filters
      </button> */}
        </div>

      </div>

        {/* Table */}
        <div className="md:p-6 p-2 mb-6 bg-white shadow rounded-md overflow-auto">
        <  div className="border border-gray-200 rounded-lg overflow-hidden bg-white mb-6" style={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          margin: '16px 0'
        }}>
        
          <table className="w-full  " >
            <thead>
              <tr className="brandorange-bg-light brandorange-text text-sm font-semibold text-left">
                <th className="p-3 border-b border-gray-200">API Name</th>
                <th className="p-3 border-b border-gray-200">Method</th>
                <th className="p-3 border-b border-gray-200">Charge</th>
                <th className="p-3 border-b border-gray-200">Active Charge</th>
                <th className="p-3 border-b border-gray-200">Endpoint</th>
                {admin?.role === "admin" && <th className="p-3 border-b border-gray-200">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    No APIs found.
                  </td>
                </tr>
              ) : (
                services.map((api, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3">
                      <div className="text-sm font-medium text-gray-700">{api.name}</div>
                      <div className="text-xs text-gray-500">{api.descreption}</div>
                    </td>
                    <td className="p-3">
                      <span
                        className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        style={getMethodClass(api.method).includes("green") ?
                          { backgroundColor: '#DCFCE7', color: '#166534' } :
                          getMethodClass(api.method).includes("blue") ?
                            { backgroundColor: '#DBEAFE', color: '#1E40AF' } :
                            getMethodClass(api.method).includes("yellow") ?
                              { backgroundColor: '#FEF3C7', color: '#92400E' } :
                              { backgroundColor: '#F3F4F6', color: '#4B5563' }
                        }
                      >
                        {api.method}
                      </span>
                    </td>
                    <td className="p-3 text-sm font-mono text-gray-700">₹{api.charge}</td>
                    <td className="p-3 text-sm font-mono text-gray-700">₹{api.active_charge}</td>
                    <td className="p-3 text-sm font-mono text-gray-700">{api.endpoint}</td>
                    {admin?.role === "admin" && (
                      <td className="p-3">
                        <button
                          onClick={() => openEditModal(api)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 500,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          className="brandorange-bg-light brandorange-text"
                        >
                          <FaEdit size={12} />
                          Edit
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center py-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              backgroundColor: page <= 1 ? '#fde8df' : '#f9c4ad',
              color: page <= 1 ? 'white' :'#b7603d' ,
              cursor: page <= 1 ? 'not-allowed' : 'pointer',
              border: 'none',
              fontSize: '14px'
            }}
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              backgroundColor: page >= totalPages ? '#fde8df' : '#f9c4ad',
              color: page >= totalPages ?  'white' :'#b7603d' ,
              cursor: page >= totalPages ? 'not-allowed' : 'pointer',
              border: 'none',
              fontSize: '14px'
            }}
            className="hover:background-[#f9c4ad] brandorange-bg-light brandorange-text"
          >
            Next
          </button>
        </div>
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
                  <textarea name="descreption" placeholder="Description" value={field.descreption} onChange={(e) => handleChange(index, e)} rows={2} className="w-full p-2 border rounded" />
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