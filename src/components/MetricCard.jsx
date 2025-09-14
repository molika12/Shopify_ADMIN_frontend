export function MetricCard({ title, value }) {
return (
<div className="bg-white shadow-md p-6 rounded-lg w-64">
<h3 className="text-gray-500">{title}</h3>
<p className="text-2xl font-bold mt-2">{value}</p>
</div>
);
}