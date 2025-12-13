import { ChevronDown } from "lucide-react";

const SelectField = ({ label, options, value, onChange }) => (
    <div className="mb-4">
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">{label}</label>
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                className="w-full uppercase bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none transition-all"
            >
                <option value="">Select</option>
                {options.map((opt, idx) => (
                    <option className="uppercase" key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
            </select>
            <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16} />
        </div>
    </div>
);

export default SelectField;
