export function ButtonLight({label, onClick}) {
    return <button onClick={onClick} type="button" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 mr-3 rounded shadow">{label}</button>
}