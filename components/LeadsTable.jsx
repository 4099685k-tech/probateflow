"use client";
import { useState } from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import ScoreBar from "./ScoreBar";
import LeadTypeBadge from "./LeadTypeBadge";

function TimeAgo({ dateString }) {
  if (!dateString) return null;
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  let text = "just now";
  if (seconds > 60) text = `${Math.floor(seconds / 60)}m ago`;
  if (seconds > 3600) text = `${Math.floor(seconds / 3600)}h ago`;
  if (seconds > 86400) text = `${Math.floor(seconds / 86400)}d ago`;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded-full">
      ● {text}
    </span>
  );
}

export default function LeadsTable({ leads }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterScore, setFilterScore] = useState("");
  const [filterType, setFilterType] = useState("");

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    if (
      q &&
      !l.name.toLowerCase().includes(q) &&
      !l.address.toLowerCase().includes(q) &&
      !l.county.toLowerCase().includes(q) &&
      !l.contact.toLowerCase().includes(q)
    )
      return false;
    if (filterStatus && l.status !== filterStatus) return false;
    if (filterType && l.leadType !== filterType) return false;
    if (filterScore === "high" && l.score < 7) return false;
    if (filterScore === "mid" && (l.score < 4 || l.score > 6)) return false;
    if (filterScore === "low" && l.score > 3) return false;
    return true;
  });

  // Sort so newest imports appear first
  const sorted = [...filtered].sort((a, b) => {
    if (a.importedAt && b.importedAt)
      return new Date(b.importedAt) - new Date(a.importedAt);
    if (a.importedAt) return -1;
    if (b.importedAt) return 1;
    return 0;
  });

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-medium text-gray-800">Leads</h2>
        <span className="text-xs text-gray-400">{filtered.length} results</span>
      </div>

      {/* Filters */}
      <div className="flex gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50/60 flex-wrap">
        <input
          type="text"
          placeholder="Search by name, address, county…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] text-xs px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-300"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="text-xs px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-300"
        >
          <option value="">All types</option>
          <option>Probate</option>
          <option>Pre-Foreclosure</option>
          <option>On-Market</option>
          <option>Off-Market</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-xs px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-300"
        >
          <option value="">All statuses</option>
          <option>New</option>
          <option>Mail Sent</option>
          <option>Follow-Up Due</option>
          <option>Interested</option>
          <option>Not Interested</option>
          <option>Closed</option>
        </select>
        <select
          value={filterScore}
          onChange={(e) => setFilterScore(e.target.value)}
          className="text-xs px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-300"
        >
          <option value="">All scores</option>
          <option value="high">High (7+)</option>
          <option value="mid">Mid (4–6)</option>
          <option value="low">Low (1–3)</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Estate / Contact</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Property Address</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Est. Value</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Score</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Follow-Up</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-sm text-gray-400">
                  No leads match your filters.
                </td>
              </tr>
            ) : (
              sorted.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3.5">
                    <Link href={`/leads/${lead.id}`} className="block">
                      <div className="font-medium text-gray-900 text-sm flex items-center gap-2">
                        {lead.name}
                        {lead.importedAt && <TimeAgo dateString={lead.importedAt} />}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{lead.contact}</div>
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <Link href={`/leads/${lead.id}`}>
                      <LeadTypeBadge type={lead.leadType} />
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-600 max-w-[180px] truncate">
                    <Link href={`/leads/${lead.id}`}>{lead.address}</Link>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-gray-800 text-sm">
                    <Link href={`/leads/${lead.id}`}>
                      ${(lead.value / 1000).toFixed(0)}k
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <Link href={`/leads/${lead.id}`}>
                      <ScoreBar score={lead.score} />
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <Link href={`/leads/${lead.id}`}>
                      <StatusBadge status={lead.status} />
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-500">
                    <Link href={`/leads/${lead.id}`}>
                      {lead.followup ?? "—"}
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}