"use client"

import { useState } from "react"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import axiosInstance from "@/components/service/axiosInstance"
// import { toast } from "react-hot-toast"

export default function CreateUserForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setForm((prev) => ({ ...prev, role: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...form
      }

      const res = await axiosInstance.post("/admin/create-user", payload)
      // toast.success("User created successfully")
      setForm({ name: "", email: "", password: "", role: "user", })
    } catch (err: any) {
      console.error(err)
      // toast.error(err.response?.data?.message || "Error creating user")
    } finally {
      setLoading(false)
    }
  }




  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-5">
      <h2 className="text-xl font-semibold text-gray-800">Create New User</h2>

      <div>
        <Label htmlFor="name">Name</Label>
        <Input name="name" value={form.name} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input type="email" name="email" value={form.email} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input type="password" name="password" value={form.password} onChange={handleChange} required />
      </div>

      {/* <div>
        <Label htmlFor="role">Role</Label>
        <Select value={form.role} onValueChange={handleRoleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div> */}

      {/* <div>
        <Label htmlFor="ipWhitelist">IP Whitelist (comma separated)</Label>
        <Textarea
          name="ipWhitelist"
          placeholder="e.g., 192.168.1.1, 10.0.0.2"
          value={form.ipWhitelist}
          onChange={handleChange}
        />
      </div> */}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating..." : "Create User"}
      </Button>
    </form>
  )
}
