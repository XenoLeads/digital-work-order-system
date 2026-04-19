import type { WorkOrder } from "@/types";

const Table = ({
  columns,
  rows,
  changeWorkOrderStatusCallback,
}: {
  columns: string[];
  rows: WorkOrder[];
  changeWorkOrderStatusCallback: ({ workOrderId, newStatus }: { workOrderId: string; newStatus: string }) => void;
}) => {
  return (
    <table className="w-full">
      <thead>
        <tr>
          {columns.map(column => (
            <th key={column} className="border border-slate-300 p-2">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row: WorkOrder) => {
          return (
            <tr key={row.id}>
              <td className="border border-slate-300 p-2">{row.asset?.assetTag}</td>
              <td className="border border-slate-300 p-2">{row.issueDesc}</td>
              <td className="border border-slate-300 p-2">{row.priority}</td>
              <td className="border border-slate-300 h-4">
                <select
                  className="bg-neutral-800 w-full h-full cursor-pointer"
                  name="status"
                  defaultValue={row.status}
                  onChange={e => changeWorkOrderStatusCallback({ workOrderId: row.id!, newStatus: e.target.value })}
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
