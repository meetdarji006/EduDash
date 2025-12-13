const Button = ({ children, onClick, variant = 'primary', icon: Icon, className = '', disabled = false }) => {
    const baseStyle = "flex items-center justify-center px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95";
    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200",
        secondary: "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50",
        danger: "bg-rose-50 text-rose-600 hover:bg-rose-100",
        success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200",
        ghost: "text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2"
    };

    return (
        <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
            {Icon && <Icon size={16} className={children ? "mr-2" : ""} />}
            {children}
        </button>
    );
};

export default Button;
