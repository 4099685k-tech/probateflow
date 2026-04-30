"use client";
import { useState, useRef } from "react";
import { calculateScore } from "@/lib/scoring";

function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, ""));
  return lines.slice(1).map((line, i) => {
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const row = {};
    headers.forEach((h, idx) => { row[h] = values[idx] || ""; });

    return {
      id: `csv-${Date.now()}-${i}`,
      name: row.name || row.estatename || row.estate || `Import ${i + 1}`,
      contact: row.contact || row.contactname || row.ownername || "",
      phone: row.phone || row.phonenumber || "",
      email: row.email || "",
      address: row.address || row.propertyaddress || "",
      county: row.county || "Orange",
      value: parseInt(row.value || row.estimatedvalue || row.price || 0) || 0,
      status: row.status || "New",
      leadType: row.leadtype || row.type || "Probate",
      followup: row.followup || row.nextfollowup || "",
      assigned: row.assigned || row.assignedto || "",
      attorney: row.attorney || "N/A",
      heirs: parseInt(row.heirs || 1),
      bedrooms: parseInt(row.bedrooms || row.beds || 3),
      sqft: parseInt(row.sqft || row.squarefeet || 1500),
      year: parseInt(row.year || row.yearbuilt || 1980),
      caseNo: row.caseno || row.casenumber || `PR-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
      filedDate: row.fileddate || new Date().toISOString().split("T")[0],
      notes: row.notes || "",
      log: [],
      importedAt: new Date().toISOString(),
    };
  });
}

export default function CSVUpload({ onImport }) {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef();

  function handleFile(file) {
    if (!file || !file.name.endsWith(".csv")) {
      setError("Please upload a .csv file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const leads = parseCSV(e.target.result);
        if (leads.length === 0) {
          setError("No leads found in this file.");
          return;
        }
        setPreview(leads);
        setError("");
      } catch {
        setError("Could not parse this file. Please check the format.");
      }
    };
    reader.readAsText(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  function handleImport() {
    const scored = preview.map((l) => ({ ...l, score: calculateScore(l) }));
    onImport(scored);
    setPreview(null);
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
      >
        ⬆ CSV Upload
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setOpen(false); setPreview(null); setError(""); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 z-10">
            <h2 className="text-base font-semibold text-gray-900 mb-1">CSV Upload</h2>
            <p className="text-xs text-gray-400 mb-5">
              Upload a .csv file with lead data. Columns are auto-mapped.
            </p>

            {!preview ? (
              <>
                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current.click()}
                  className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                    dragging ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <div className="text-3xl mb-2">📂</div>
                  <div className="text-sm font-medium text-gray-700">Drop your CSV here</div>
                  <div className="text-xs text-gray-400 mt-1">or click to browse</div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files[0])}
                  />
                </div>

                {error && (
                  <div className="mt-3 bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg">{error}</div>
                )}

                {/* Sample format hint */}
                <div className="mt-4 bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-gray-600 mb-1">Expected columns:</div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    name, contact, address, county, value, status, leadType, followup, attorney, heirs
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Preview */}
                <div className="bg-emerald-50 text-emerald-700 text-xs px-3 py-2 rounded-lg mb-4 font-medium">
                  ✓ Found {preview.length} leads ready to import
                </div>

                <div className="border border-gray-100 rounded-xl overflow-hidden mb-5">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left px-3 py-2 text-gray-400 font-medium">Name</th>
                        <th className="text-left px-3 py-2 text-gray-400 font-medium">Address</th>
                        <th className="text-left px-3 py-2 text-gray-400 font-medium">Value</th>
                        <th className="text-left px-3 py-2 text-gray-400 font-medium">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.slice(0, 5).map((l, i) => (
                        <tr key={i} className="border-b border-gray-50 last:border-0">
                          <td className="px-3 py-2 font-medium text-gray-800">{l.name}</td>
                          <td className="px-3 py-2 text-gray-500 truncate max-w-[120px]">{l.address}</td>
                          <td className="px-3 py-2 text-gray-700">${(l.value / 1000).toFixed(0)}k</td>
                          <td className="px-3 py-2 text-gray-500">{l.leadType}</td>
                        </tr>
                      ))}
                      {preview.length > 5 && (
                        <tr>
                          <td colSpan={4} className="px-3 py-2 text-center text-gray-400">
                            +{preview.length - 5} more leads
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPreview(null)}
                    className="flex-1 py-2.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    ← Re-upload
                  </button>
                  <button
                    onClick={handleImport}
                    className="flex-1 py-2.5 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    Import {preview.length} Leads
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}