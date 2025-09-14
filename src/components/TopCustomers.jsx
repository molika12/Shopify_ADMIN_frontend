// src/components/TopCustomers.jsx
export function TopCustomers({ customers = [], orders = [] }) {
  // Compute total spent and order count per customer
  const customerStats = customers.map((c) => {
    const customerOrders = orders.filter((o) => o.email === c.email);
    const totalSpent = customerOrders.reduce(
      (acc, o) => acc + parseFloat(o.total_price || 0),
      0
    );
    return {
      ...c,
      totalSpent,
      orderCount: customerOrders.length,
    };
  });

  // Sort by totalSpent descending and take top 5
  const top5 = customerStats.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

  if (top5.length === 0) return <p className="text-gray-500">No top customers found.</p>;

  return (
    <ul className="divide-y">
      {top5.map((c, i) => (
        <li key={i} className="py-3 flex justify-between items-center">
          <div>
            <p className="font-medium">{c.first_name || ""} {c.last_name || ""}</p>
            <p className="text-gray-500 text-sm">{c.email}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">${c.totalSpent.toFixed(2)}</p>
            <p className="text-gray-500 text-sm">{c.orderCount} orders</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
