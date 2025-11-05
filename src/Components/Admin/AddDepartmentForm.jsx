'use client';
import React, { useState } from 'react';
import { FaSitemap } from 'react-icons/fa';
import { createDepartment } from '../../api/admin';

export default function AddDepartmentForm({ onSubmit }) {
  const [departmentName, setDepartmentName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!departmentName.trim()) {
      setError('Please enter a department name.');
      return;
    }
    try {
      setSubmitting(true);
      if (typeof onSubmit === 'function') {
        await onSubmit({ name: departmentName.trim() });
      } else {
        await createDepartment({ name: departmentName.trim() });
      }
      setSuccess('Department added successfully.');
      setDepartmentName('');
    } catch (err) {
      setError(err?.message || 'Failed to add department.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white/70 backdrop-blur rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 text-teal-700">
            <FaSitemap />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Add Department</h2>
            <p className="text-xs text-gray-500">Create a new department</p>
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
            <label className="text-sm text-gray-600">Department name</label>
            <input
              type="text"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              placeholder="e.g., Retail, Operations, Finance"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder:text-gray-600 placeholder:opacity-90 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl text-white font-medium shadow-md transition-transform active:scale-[0.99] ${submitting ? 'bg-teal-300 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`}
            >
              {submitting ? 'Saving...' : 'Add Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


