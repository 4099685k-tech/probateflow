"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { mockLeads } from "@/data/mockLeads";
import { calculateScore } from "@/lib/scoring";
import StatCard from "@/components/StatCard";
import LeadsTable from "@/components/LeadsTable";
import ImportLeadsModal from "@/components/ImportLeadsModal";
import AddLeadModal from "@/components/AddLeadModal";
import CSVUpload from "@/components/CSVUpload";

export default function DashboardPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load leads from Supabase on page load
  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("imported_at", { ascending: false });

    if (error) {
      console.error("Error loading leads:", error);
      // Fall back to mock data if Supabase fails
      const scored = mockLeads.map((l) => ({
        ...l,
        score: calculateScore(l),
        leadType: "Probate",
      }));
      setLeads(scored);
    } else if (data.length === 0) {
      // First time — seed with mock data
      await seedMockLeads();
    } else {
      const scored = data.map((l) => ({
        ...l,
        leadType: l.lead_type,
        caseNo: l.case_no,
        filedDate: l.filed_date,
        importedAt: l.imported_at,
        score: l.score || calculateScore(l),
      }));
      setLeads(scored);
    }
    setLoading(false);
  }

  async function seedMockLeads() {
    const scored = mockLeads.map((l) => ({
      ...l,
      score: calculateScore(l),
      leadType: "Probate",
    }));
    await saveleadsToSupabase(scored);
    setLeads(scored);
  }

  async function saveleadsToSupabase(newLeads) {
    const rows = newLeads.map((l) => ({
      id: l.id,
      name: l.name,
      contact: l.contact,
      phone: l.phone,
      email: l.email,
      address: l.address,
      county: l.county,
      value: l.value,
      status: l.status,
      lead_type: l.leadType || l.lead_type || "Probate",
      followup: l.followup,
      assigned: l.assigned,
      attorney: l.attorney,
      heirs: l.heirs,
      bedrooms: l.bedrooms,
      sqft: l.sqft,
      year: l.year,
      case_no: l.caseNo || l.case_no,
      filed_date: l.filedDate || l.filed_date,
      notes: l.notes,
      log: l.log || [],
      score: l.score || 0,
      imported_at: l.importedAt || new Date().toISOString(),
    }));

    const { error } = await supabase.from("leads").upsert(rows);
    if (error) console.error("Error saving leads:", error);
  }

  async function handleImport(newLeads) {
    const scored = newLeads.map((l) => ({ ...l, score: calculateScore(l) }));
    await saveleadsToSupabase(scored);
    setLeads((prev) => [...scored, ...prev]);
  }

  async function handleAddLead(newLead) {
    const scored = { ...newLead, score: calculateScore(newLead) };
    await saveleadsToSupabase([scored]);
    setLeads((prev) => [scored, ...prev]);
  }

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "New").length;
  const highValue = leads.filter((l) => l.value >= 500000).length;
  const followupsDue = leads.filter((l) => l.status === "Follow-Up Due").length;
  const highValueTotal = leads
    .filter((l) => l.value >= 500000)
    .reduce((sum, l) => sum + l.value, 0);

  const today = new Date();
  const overdue = leads.filter((l) => {
    if (!l.followup) return false;
    return new Date(l.followup) < today && l.status === "Follow-Up Due";
  }).length;

  return (
    <>
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Orange County, CA &middot; April 2026
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ImportLeadsModal onImport={handleImport} />
          <CSVUpload onImport={handleImport} />
          <AddLeadModal onAdd={handleAddLead} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-sm text-gray-400">Loading leads...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4">
              <StatCard
                label="Total Leads"
                value={totalLeads}
                delta={`${newLeads} new leads`}
                deltaType="up"
                barColor="#1a4d8f"
                barPercent={Math.min(Math.round((totalLeads / 50) * 100), 100)}
              />
              <StatCard
                label="New Leads"
                value={newLeads}
                delta="Uncontacted"
                deltaType="up"
                barColor="#5a9cf5"
                barPercent={Math.round((newLeads / totalLeads) * 100)}
              />
              <StatCard
                label="High-Value Opportunities"
                value={highValue}
                delta={`$${(highValueTotal / 1000000).toFixed(1)}M combined est.`}
                deltaType="up"
                barColor="#10b981"
                barPercent={Math.round((highValue / totalLeads) * 100)}
              />
              <StatCard
                label="Follow-Ups Due"
                value={followupsDue}
                delta={`${overdue} overdue`}
                deltaType="warn"
                barColor="#f59e0b"
                barPercent={Math.round((followupsDue / totalLeads) * 100)}
              />
            </div>
            <LeadsTable leads={leads} />
          </>
        )}
      </div>
    </>
  );
}