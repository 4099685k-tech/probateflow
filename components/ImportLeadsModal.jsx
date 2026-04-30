"use client";
import { useState } from "react";
import { generateBatch, LEAD_TYPES } from "@/lib/leadGenerator";
import LeadTypeBadge from "./LeadTypeBadge";

export default function ImportLeadsModal({ onImport }) {
  const [open, setOpen] = useState(false);
  const [leadType, setLeadType] = useState("Probate");
  const [batchSize, setBatchSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [lastImport, setLastImport] = useState(null);

  function handleImport() {
    setLoading(true);
    setTimeout(() => {
      const newLeads = generateBatch(batchSize, leadType);
      onImport(newLeads);
      setLastImport({ count: batchSize, type: leadType, time: new Date() });
      setLoading(false);
      setOpen(false);
    }, 800);
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="text-xs px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors font-medium flex items-center gap-1.5"
      >
        <span>⬇</span> Import New Leads
      </button>

      {/* Last import info */}
      {lastImport && (
        <div className="text-xs text-gray-400 flex items-center gap-1">
          Last import: {lastImport.count} {lastImport.type} leads·{" "}
          <TimeAgo date={lastImport.time} />
        </div>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Modal box */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 z-10">
            <h2 className="text-base font-semibold text-gray-900 mb-1">
              Import New Leads
            </h2>
            <p className="text-xs text-gray-400 mb-5">
              Simulate a batch of incoming leads for demo purposes.
            </p>

            {/* Lead Type */}
            <div className="mb-4">
              <label className="text-xs font-medium text-gray-600 mb-2 block">
                Lead Type
              </label>
              <div className="flex flex-wrap gap-2">
                {LEAD_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setLeadType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      leadType === type
                        ? "bg-[#0f2d5a] text-white border-[#0f2d5a]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Batch Size */}
            <div className="mb-6">
              <label className="text-xs font-medium text-gray-600 mb-2 block">
                Batch Size: <span className="text-gray-900 font-semibold">{batchSize} leads</span>
              </label>
              <div className="flex gap-2">
                {[1, 5, 10, 25].map((n) => (
                  <button
                    key={n}
                    onClick={() => setBatchSize(n)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                      batchSize === n
                        ? "bg-[#0f2d5a] text-white border-[#0f2d5a]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-3 mb-5 flex items-center justify-between">
              <div className="text-xs text-gray-500">You're importing</div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">{batchSize}</span>
                <LeadTypeBadge type={leadType} />
                <span className="text-xs text-gray-500">leads</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-2.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={loading}
                className="flex-1 py-2.5 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60"
              >
                {loading ? "Importing..." : `Import ${batchSize} Leads`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Timestamp component
function TimeAgo({ date }) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let text = "just now";
  if (seconds > 60) text = `${Math.floor(seconds / 60)} min ago`;
  if (seconds > 3600) text = `${Math.floor(seconds / 3600)}h ago`;
  return <span>{text}</span>;
}