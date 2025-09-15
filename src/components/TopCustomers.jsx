
import React from "react";

export function TopCustomers({ customers }) {
  if (!customers || customers.length === 0) {
    return <p className="text-gray-500">No customers found.</p>;
  }

  return (
    <ul className="divide-y">
      {customers.map((cust, index) => (
        <li
          key={index}
          className="py-3 flex justify-between items-center"
        >
          <div>
            <p className="font-medium text-gray-800">{cust.name}</p>
            <p className="text-xs text-gray-500">{cust.email}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-700 font-semibold">
          ₹{cust.totalSpent.toFixed(2)}
        </p>

            <p className="text-xs text-gray-500">{cust.orderCount} orders</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
