import { Search } from 'lucide-react'

function SearchBar({ value, onChange, label = '', className, placeholder }) {
    return (
        <div className={className}>
            {label.trim() !== '' && <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">{label}</label>}
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-300">
                    <Search size={20} strokeWidth={2.5} />
                </div>
                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full bg-white border-0 ring-1 ring-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm group-hover:shadow-md focus:shadow-xl transition-all duration-300 placeholder:text-slate-400 placeholder:font-medium"
                    value={value}
                    onChange={onChange}
                />
            </div>
        </div>
    )
}

export default SearchBar
