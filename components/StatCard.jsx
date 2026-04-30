export default function StatCard({ label, value, delta, deltaType = "up", barColor, barPercent }) {
  const deltaColor =
    deltaType === "up"
      ? "text-emerald-600"
      : deltaType === "warn"
      ? "text-amber-500"
      : "text-gray-400";

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <div className="text-xs text-gray-500 mb-1.5">{label}</div>
      <div className="text-3xl font-semibold text-gray-900">{value}</div>
      {delta && (
        <div className={`text-xs mt-1 ${deltaColor}`}>{delta}</div>
      )}
      {barPercent !== undefined && (
        <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${barPercent}%`, backgroundColor: barColor || "#1a4d8f" }}
          />
        </div>
      )}
    </div>
  );
}