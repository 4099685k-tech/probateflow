import { mockLeads } from "@/data/mockLeads";
import { calculateScore } from "@/lib/scoring";
import StatCard from "@/components/StatCard";
import LeadsTable from "@/components/LeadsTable";

export default function DashboardPage() {
  const leads = mockLeads.map((l) => ({ ...l, score: calculateScore(l) }));

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
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Orange County, CA &middot; April 2026
          </p>
        </div>
        <div className="flex gap-2">
          <button className="text-xs px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors">
            Export CSV
          </button>
          <button className="text-xs px-4 py-2 rounded-lg bg-[#0f2d5a] text-white hover:bg-[#1a4d8f] transition-colors font-medium">
            + Add Lead
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Total Leads"
            value={totalLeads}
            delta="+6 this month"
            deltaType="up"
            barColor="#1a4d8f"
            barPercent={72}
          />
          <StatCard
            label="New Leads"
            value={newLeads}
            delta="+3 this week"
            deltaType="up"
            barColor="#5a9cf5"
            barPercent={33}
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
      </div>
    </>
  );
}