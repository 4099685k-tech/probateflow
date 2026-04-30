import { LEAD_TYPE_COLORS } from "@/lib/leadGenerator";

export default function LeadTypeBadge({ type }) {
  if (!type) return null;
  const style = LEAD_TYPE_COLORS[type] || "bg-gray-100 text-gray-600 border border-gray-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {type}
    </span>
  );
}