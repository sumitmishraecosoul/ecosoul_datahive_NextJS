"use client";
import AddUserForm from '../../../Components/Admin/AddUserForm';
import AddDepartmentForm from '../../../Components/Admin/AddDepartmentForm';
import { createUser, createDepartment } from '../../../api/admin';

export default function AdminPage() {
  async function handleAddUser(payload) {
    // Forward to backend API
    const res = await createUser(payload);
    return res;
  }

  async function handleAddDepartment(payload) {
    // Forward to backend API
    const res = await createDepartment(payload);
    return res;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-800">Admin</h1>
        <p className="text-sm text-gray-500">Manage users and departments</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <AddUserForm onSubmit={handleAddUser} />
        <AddDepartmentForm onSubmit={handleAddDepartment} />
      </div>
    </div>
  );
}


