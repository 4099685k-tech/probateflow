export default function ScoreBar({ score }) {
  const color =
    score >= 7
      ? "bg-emerald-500"
      : score >= 4
      ? "bg-amber-400"
      : "bg-red-400";

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-2 rounded-sm ${i < score ? color : "bg-gray-200"}`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-400 w-4">{score}</span>
    </div>
  );
}