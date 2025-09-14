// src/components/Table.jsx
export function Table({ columns, data }) {
  return (
    <div className="overflow-x-auto rounded-xl shadow bg-white">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-gray-100 text-gray-700 text-left">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-3 font-medium border-b">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                {columns.map((col, j) => (
                  <td key={j} className="px-4 py-3 text-gray-700">
                    {row[col.toLowerCase()]} {/* assumes keys are lowercase */}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
