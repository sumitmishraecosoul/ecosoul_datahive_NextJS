'use client';
import React, { useEffect, useState } from 'react';
import { FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import { createUser, getAllDepartments } from '../../api/admin';

export default function AddUserForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !password.trim() || !department.trim()) {
      setError('Please fill out all fields.');
      return;
    }

    const emailOk = /.+@.+\..+/.test(email);
    if (!emailOk) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setSubmitting(true);
      // Send department as the department id (dId)
      const departmentId = typeof department === 'string' ? department.trim() : department;
      if (typeof onSubmit === 'function') {
        await onSubmit({ name: name.trim(), email: email.trim(), department: departmentId, password });
      } else {
        await createUser({ name: name.trim(), email: email.trim(), department: departmentId, password });
      }
      setSuccess('User added successfully.');
      setName('');
      setEmail('');
      setDepartment('');
      setPassword('');
    } catch (err) {
      setError(err?.message || 'Failed to add user.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getAllDepartments();
        // Support both {departments:[...]} and direct array
        const list = Array.isArray(data) ? data : (data?.departments || []);
        if (mounted) setDepartments(list);
      } catch (e) {
        // Fail silently, keep manual input fallback
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white/70 backdrop-blur rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 text-teal-700">
            <FaUserPlus />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Add User</h2>
            <p className="text-xs text-gray-500">Create a new team member</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>
          )}
          {success && (
            <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">{success}</div>
          )}

          <div className="space-y-1">
            <label className="text-sm text-gray-600">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder:text-gray-600 placeholder:opacity-90 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder:text-gray-600 placeholder:opacity-90 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600">Department</label>
            {departments && departments.length > 0 ? (
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
              >
                <option value="">Select a department</option>
                {departments.map((d) => {
                  const id = (d && (d.id || d._id || d.departmentId || d.dId || d.value)) ?? '';
                  const label = (d && (d.name || d.departmentName || d.label || String(id))) ?? '';
                  const key = id || label;
                  return (
                    <option key={key} value={id}>{label}</option>
                  );
                })}
              </select>
            ) : (
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Enter department id (e.g., 1, 2, 3, 4)"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder:text-gray-600 placeholder:opacity-90 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
              />
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder:text-gray-600 placeholder:opacity-90 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-2"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl text-white font-medium shadow-md transition-transform active:scale-[0.99] ${submitting ? 'bg-teal-300 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`}
            >
              {submitting ? 'Saving...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


