export function ButtonDark({label, onClick}) {
    return <button onClick={onClick} type="button" className="bg-slate-800 hover:bg-gray-100 hover:text-black text-white font-semibold py-2 px-4 border border-gray-400 rounded shadow">{label}</button>
}