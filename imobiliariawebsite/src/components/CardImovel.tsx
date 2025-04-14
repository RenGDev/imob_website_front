import { ImovelItf } from "@/utils/types/ImovelItf"
import Link from "next/link"

export function CardImovel({data} : {data: ImovelItf}){
    return(

        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <img className="rounded-t-lg object-cover" src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI7qpM9P3x3tmRUFYJ21fY6mEQ3eb4BdMNlg&s' alt="Foto" />
            <div className="p-5">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {data.description}
                </h5>
                <p className="mb-3 font-extrabold text-gray-700 dark:text-gray-400">
                    Preço R$: {Number(data.price).toLocaleString("pt-br", {
                        minimumFractionDigits: 2
                    })}
                </p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    Especificações: {data.type} - {data.size}m2
                </p>
                <Link href={`/detalhes/${data.id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Ver Detalhes
                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </Link>
            </div>
        </div>
    )
}
