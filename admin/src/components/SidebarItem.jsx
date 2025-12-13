const SidebarItem = ({ icon: Icon, label, path, active, onClick }) => (
    <button
        onClick={() => onClick(path)}
        className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${active
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 font-bold'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
            }`}
    >
        <Icon size={20} className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
        <span>{label}</span>
    </button>
);

export default SidebarItem;
