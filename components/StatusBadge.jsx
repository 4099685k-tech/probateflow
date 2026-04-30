const statusStyles = {
  New: "bg-blue-50 text-blue-700 border border-blue-200",
  "Mail Sent": "bg-green-50 text-green-700 border border-green-200",
  "Follow-Up Due": "bg-amber-50 text-amber-700 border border-amber-200",
  Interested: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Closed: "bg-gray-100 text-gray-600 border border-gray-200",
  "Not Interested": "bg-gray-100 text-gray-500 border border-gray-200",
};

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || statusStyles["New"];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}