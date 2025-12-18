function PageHeader({ title, description, icon: Icon }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in slide-in-from-top-2 duration-500">
            <div className="flex items-center gap-4">
                {Icon && (
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-indigo-600">
                        <Icon size={24} strokeWidth={2.5} />
                    </div>
                )}
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{title}</h1>
                    {description && <p className="text-slate-500 font-bold text-xs mt-0.5">{description}</p>}
                </div>
            </div>
        </div>
    )
}

export default PageHeader
