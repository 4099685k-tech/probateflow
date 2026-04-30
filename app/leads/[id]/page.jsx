"use client";
import { useState, use } from "react";
import Link from "next/link";
import { mockLeads } from "@/data/mockLeads";
import { calculateScore } from "@/lib/scoring";
import StatusBadge from "@/components/StatusBadge";
import ScoreBar from "@/components/ScoreBar";
import LeadTypeBadge from "@/components/LeadTypeBadge";
import { ArrowLeft, MapPin } from "lucide-react";

const logTypeColors = {
  Call: "bg-blue-100 text-blue-700",
  Mailer: "bg-green-100 text-green-700",
  Email: "bg-purple-100 text-purple-700",
  Note: "bg-gray-100 text-gray-600",
};

export default function LeadDetailPage({ params }) {
  const { id } = use(params);
const raw = mockLeads.find((l) => l.id === String(id));
  if (!raw) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Lead not found</h2>
          <p className="text-sm text-gray-400 mb-4">This lead may have been added dynamically and isn't persisted yet.</p>
          <Link href="/" className="text-xs px-4 py-2 rounded-lg bg-[#0f2d5a] text-white hover:bg-[#1a4d8f] transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const lead = { ...raw, score: calculateScore(raw), leadType: raw.leadType || "Probate" };

  const [notes, setNotes] = useState(lead.notes);
  const [noteSaved, setNoteSaved] = useState(false);
  const [log, setLog] = useState(lead.log);
  const [logType, setLogType] = useState("Call");
  const [logText, setLogText] = useState("");
  const [showLogForm, setShowLogForm] = useState(false);

  function handleSaveNote() {
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  }

  function handleAddLog() {
    if (!logText.trim()) return;
    const entry = {
      date: new Date().toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      }),
      type: logType,
      text: logText,
    };
    setLog((prev) => [entry, ...prev]);
    setLogText("");
    setShowLogForm(false);
  }

  return (
    <>
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft size={13} />
            Back to Dashboard
          </Link>
          <span className="text-gray-200">/</span>
          <span className="text-sm font-medium text-gray-800">{lead.name}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowLogForm(true)}
            className="text-xs px-4 py-2 rounded-lg bg-[#0f2d5a] text-white hover:bg-[#1a4d8f] transition-colors font-medium"
          >
            Log Contact
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-5">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{lead.name}</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
              <MapPin size={11} />
              {lead.address}
            </div>
            <div className="flex items-center gap-3 mt-3">
              <StatusBadge status={lead.status} />
              <LeadTypeBadge type={lead.leadType} />
              <ScoreBar score={lead.score} />
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-gray-900">
              ${lead.value.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">Estimated value</div>
            <div className="text-xs text-gray-500 mt-2">
              Assigned to <span className="font-medium text-gray-700">{lead.assigned}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Property Info</h3>
            <dl className="space-y-2.5">
              {[
                ["Bedrooms", `${lead.bedrooms} bd`],
                ["Square Footage", `${lead.sqft.toLocaleString()} sf`],
                ["Year Built", lead.year],
                ["County", lead.county],
                ["Contact", lead.contact],
                ["Phone", lead.phone],
                ["Email", lead.email],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                  <dt className="text-xs text-gray-400">{label}</dt>
                  <dd className="text-xs font-medium text-gray-700">{val}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Probate / Case Info</h3>
            <dl className="space-y-2.5">
              {[
                ["Case No.", lead.caseNo],
                ["Filed Date", lead.filedDate],
                ["Attorney", lead.attorney],
                ["Number of Heirs", lead.heirs],
                ["Next Follow-Up", lead.followup ?? "Not set"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                  <dt className="text-xs text-gray-400">{label}</dt>
                  <dd className="text-xs font-medium text-gray-700">{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              className="w-full text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-1 focus:ring-blue-300"
            />
            <button
              onClick={handleSaveNote}
              className={`mt-2 text-xs px-4 py-2 rounded-lg font-medium transition-all ${
                noteSaved ? "bg-emerald-500 text-white" : "bg-[#0f2d5a] text-white hover:bg-[#1a4d8f]"
              }`}
            >
              {noteSaved ? "✓ Saved!" : "Save Note"}
            </button>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Outreach Log</h3>

            {showLogForm && (
              <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-2">
                <select
                  value={logType}
                  onChange={(e) => setLogType(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300 bg-white"
                >
                  <option>Call</option>
                  <option>Email</option>
                  <option>Mailer</option>
                  <option>Note</option>
                </select>
                <textarea
                  value={logText}
                  onChange={(e) => setLogText(e.target.value)}
                  placeholder="What happened on this contact?"
                  rows={2}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300 resize-none"
                />
                <div className="flex gap-2">
                  <button onClick={() => setShowLogForm(false)}
                    className="flex-1 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-100">
                    Cancel
                  </button>
                  <button onClick={handleAddLog}
                    className="flex-1 py-1.5 text-xs bg-[#0f2d5a] text-white rounded-lg hover:bg-[#1a4d8f]">
                    Add Entry
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3 max-h-52 overflow-y-auto">
              {log.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">No contact logged yet.</p>
              )}
              {log.map((entry, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full mt-0.5 flex-shrink-0 ${logTypeColors[entry.type] || logTypeColors.Note}`}>
                    {entry.type}
                  </span>
                  <div>
                    <div className="text-[10px] text-gray-400">{entry.date}</div>
                    <div className="text-xs text-gray-700 mt-0.5">{entry.text}</div>
                  </div>
                </div>
              ))}
            </div>

            {!showLogForm && (
              <button onClick={() => setShowLogForm(true)}
                className="mt-4 w-full text-xs px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 transition-colors">
                + Add Log Entry
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}