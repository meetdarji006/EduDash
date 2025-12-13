const TableHeader = ({ cols }) => (
    <thead className="bg-slate-50 border-b border-slate-100 text-left">
        <tr>
            {cols.map((col, idx) => (
                <th key={idx} className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {col}
                </th>
            ))}
            <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
        </tr>
    </thead>
);

export default TableHeader;
