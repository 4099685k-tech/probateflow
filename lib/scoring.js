export function scoreLeads(leads) {
  return leads.map((lead) => ({
    ...lead,
    score: calculateScore(lead),
  }));
}

export function calculateScore(lead) {
  let score = 0;

  if (lead.value >= 1000000) score += 3;
  else if (lead.value >= 500000) score += 2;
  else if (lead.value >= 300000) score += 1;

  const statusPoints = {
    Interested: 3,
    "Follow-Up Due": 2,
    "Mail Sent": 1,
    New: 1,
    Closed: 0,
    "Not Interested": 0,
  };
  score += statusPoints[lead.status] ?? 0;

  if (lead.heirs === 1) score += 2;
  else if (lead.heirs === 2) score += 1;

  if (lead.attorney && lead.attorney !== "N/A") score += 1;

  const filed = new Date(lead.filedDate);
  const now = new Date();
  const monthsAgo = (now - filed) / (1000 * 60 * 60 * 24 * 30);
  if (monthsAgo <= 3) score += 1;

  return Math.min(score, 10);
}

export function getScoreLabel(score) {
  if (score >= 7) return "High";
  if (score >= 4) return "Mid";
  return "Low";
}

export function getScoreColor(score) {
  if (score >= 7) return "text-emerald-600";
  if (score >= 4) return "text-amber-500";
  return "text-red-500";
}