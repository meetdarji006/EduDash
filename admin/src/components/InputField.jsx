const InputField = ({ name, label, type = "text", placeholder, value, onChange, required = false, multiline = false }) => (
    <div className="mb-4">
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">
            {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {multiline ? (
            <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none h-24"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                name={name}
            />
        ) : (
            <input
                name={name}
                type={type}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        )}
    </div>
);

export default InputField;
