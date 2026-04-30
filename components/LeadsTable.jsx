"use client";
import { useState } from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import ScoreBar from "./ScoreBar";

export default function LeadsTable({ leads }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterScore, setFilterScore] = useState("");

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
    if (filterScore === "high" && l.score < 7) return false;
    if (filterScore === "mid" && (l.score < 4 || l.score > 6)) return false;
    if (filterScore === "low" && l.score > 3) return false;
    return true;
  });

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-medium text-gray-800">Leads</h2>
        <span className="text-xs text-gray-400">{filtered.length} results</span>
      </div>

      <div className="flex gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50/60">
        <input
          type="text"
          placeholder="Search by name, address, county…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-300"
        />
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

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Estate / Contact</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Property Address</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">County</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Est. Value</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Score</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Next Follow-Up</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-sm text-gray-400">
                  No leads match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3.5">
                    <Link href={`/leads/${lead.id}`} className="block">
                      <div className="font-medium text-gray-900 text-sm">{lead.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{lead.contact}</div>
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-600 max-w-[200px] truncate">
                    <Link href={`/leads/${lead.id}`}>{lead.address}</Link>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-600">
                    <Link href={`/leads/${lead.id}`}>{lead.county}</Link>
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