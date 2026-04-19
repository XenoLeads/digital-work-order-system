export type ColumnDef<T> = {
  header: string;
  key?: keyof T;
  render?: (row: T) => React.ReactNode;
};

type TableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
};

export default function Table<T>({ data, columns }: TableProps<T>) {
  return (
    <table className="min-w-full divide-y divide-gray-200 max-w-full">
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index} className="px-6 py-3 text-left">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className="border-b">
            {columns.map((col, colIndex) => (
              <td key={colIndex} className={`px-6 py-4 ${col.header === "Description" ? "max-w-xs break-all" : ""}`}>
                {col.render ? col.render(row) : String(row[col.key as keyof T])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
