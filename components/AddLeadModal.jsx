"use client";
import { useState } from "react";

const emptyForm = {
  name: "",
  contact: "",
  phone: "",
  email: "",
  address: "",
  county: "Orange",
  value: "",
  status: "New",
  leadType: "Probate",
  followup: "",
  assigned: "",
  attorney: "",
  heirs: "",
  notes: "",
};

export default function AddLeadModal({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit() {
    if (!form.name || !form.address || !form.value) {
      setError("Please fill in Estate Name, Address, and Estimated Value.");
      return;
    }
    const newLead = {
      ...form,
      id: `manual-${Date.now()}`,
      value: parseInt(form.value),
      heirs: parseInt(form.heirs) || 1,
      bedrooms: 3,
      sqft: 1500,
      year: 1980,
      caseNo: `PR-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
      filedDate: new Date().toISOString().split("T")[0],
      log: [],
      importedAt: new Date().toISOString(),
    };
    onAdd(newLead);
    setForm(emptyForm);
    setError("");
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs px-4 py-2 rounded-lg bg-[#0f2d5a] text-white hover:bg-[#1a4d8f] transition-colors font-medium"
      >
        + Add Lead
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 z-10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Add New Lead</h2>
            <p className="text-xs text-gray-400 mb-5">Manually enter a new lead into the pipeline.</p>

            {error && (
              <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Estate Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Martinez Estate"
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Contact Name</label>
                  <input name="contact" value={form.contact} onChange={handleChange} placeholder="e.g. Rosa Martinez"
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300" />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="(714) 555-0000"
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Email</label>
                  <input name="email" value={form.email} onChange={handleChange} placeholder="email@example.com"
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300" />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Property Address *</label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="123 Main St, Anaheim, CA 92801"
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300" />
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Estimated Value *</label>
                  <input name="value" value={form.value} onChange={handleChange} placeholder="450000" type="number"
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Number of Heirs</label>
                  <input name="heirs" value={form.heirs} onChange={handleChange} placeholder="1" type="number"
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300" />
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Lead Type</label>
                  <select name="leadType" value={form.leadType} onChange={handleChange}
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300">
                    <option>Probate</option>
                    <option>Pre-Foreclosure</option>
                    <option>On-Market</option>
                    <option>Off-Market</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Status</label>
                  <select name="status" value={form.status} onChange={handleChange}
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300">
                    <option>New</option>
                    <option>Mail Sent</option>
                    <option>Follow-Up Due</option>
                    <option>Interested</option>
                    <option>Not Interested</option>
                    <option>Closed</option>
                  </select>
                </div>
              </div>

              {/* Row 5 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Assigned To</label>
                  <input name="assigned" value={form.assigned} onChange={handleChange} placeholder="e.g. J. Torres"
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Next Follow-Up</label>
                  <input name="followup" value={form.followup} onChange={handleChange} type="date"
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300" />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Any initial notes about this lead..."
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300 resize-none" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-5">
              <button onClick={() => setOpen(false)}
                className="flex-1 py-2.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit}
                className="flex-1 py-2.5 text-xs font-medium bg-[#0f2d5a] text-white rounded-lg hover:bg-[#1a4d8f] transition-colors">
                Add Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}