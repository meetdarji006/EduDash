import React from 'react'

function Loading({ text, size = 8 }) {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <div style={{ width: size, height: size }} className="animate-spin rounded-full border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-slate-500 font-medium">{text}</p>
        </div>
    )
}

export default Loading
