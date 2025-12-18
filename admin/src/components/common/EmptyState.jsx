import { Filter } from 'lucide-react'
import React from 'react'

function EmptyState({ size = 36, title, description }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm transform -rotate-3 transition-transform hover:rotate-0 duration-300">
                <Filter className="text-slate-300" size={size} />
            </div>
            <h3 className="text-slate-900 font-black text-xl mb-2">{title}</h3>
            <p className="text-slate-500 font-medium text-sm max-w-sm text-center">
                {description}
            </p>
        </div>
    )
}

export default EmptyState
