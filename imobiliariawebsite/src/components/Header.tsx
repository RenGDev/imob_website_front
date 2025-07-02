'use client'

import 'flowbite'

import { useAuthStore } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'


function Header(){

		const { user, signOut } = useAuthStore()
		const router = useRouter()

		const [isOpen, setIsOpen] = useState(false);
		const menuRef = useRef<HTMLDivElement>(null)
		
		useEffect(() => {
        	function handleClickOutside(event: MouseEvent) {
        	    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        	        setIsOpen(false)
        	    }
        	}
		
        	document.addEventListener('mousedown', handleClickOutside)
        	return () => {
        	    document.removeEventListener('mousedown', handleClickOutside)
        	}
    	}, [])

		function clienteSair() {
				if (confirm("Confirma saída do sistema?")) {
						signOut()
						if (localStorage.getItem("clienteKey")) {
								localStorage.removeItem("clienteKey")
						}
						router.push("/login")
				}
		}

		return(
			<nav className="bg-amber-300 border-gray-200 shadow-lg">
				<div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-2 px-4">
					<a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
						<svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  							<path fill-rule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clip-rule="evenodd"/>
						</svg>
						<span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">LQ Imoveis</span>
					</a>
					<div className="flex items-center gap-6">
						<div className="hidden md:flex items-center" id="navbar-user">
							<ul className="flex flex-col font-medium items-center p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
								<li><a href="/todos" className="block py-2 px-3 text-purple-500 hover:text-purple-600 md:p-0">Imoveis</a></li>
								<hr className='w-px h-5 bg-white opacity-70 border-0'/>
								<li><Link href="/register-imovel" className="block py-2 px-3 text-purple-500 hover:text-purple-600 md:p-0">Anunciar</Link></li>
							</ul>
						</div>

						<hr className='w-px h-7 bg-white opacity-70 border-0'/>

						<div className="flex items-center md:order-2">
							{user?.id ? (
								<>
									<div className="relative" ref={menuRef}>
                		    	    	<button 
                		    	    	    onClick={() => setIsOpen(!isOpen)}
                		    	    	    className="h-9 w-9 relative rounded-full border-2 border-white focus:outline-none"
                		    	    	>
                		    	    	    <img src="/user-avatar.png" alt="User avatar" className='h-full w-full rounded-full'/>
                		    	    	</button>

                		    	    	<div 
                		    	    	    id="user-menu"
                		    	    	    className={`w-52 gap-4 right-0 top-12 ${isOpen ? 'flex' : 'hidden'} absolute bg-black text-white rounded-md flex-col z-50`}
                		    	    	>
                		    	    	    <div className='flex flex-col px-5 pt-5'>
                		    	    	        <span className='font-bold'>{user.name}</span>
                		    	    	        <span className='text-gray-400 text-sm'>{user.email}</span>
                		    	    	    </div>
                		    	    	    <hr className='border-gray-500'/>
                		    	    	    <ul className='flex flex-col gap-3 px-5 pb-5'>
												{user.role == "ADMIN" &&
													<li><a href="/admin/estatisticas" className="hover:text-blue-500">Estatisticas</a></li>
												}
                		    	    	        <li><a href="#" className="hover:text-blue-500">Meus imoveis</a></li>
												<li><a href="/propostas" className="hover:text-blue-500">Minhas propostas</a></li>
                		    	    	        <li><a href="#" className="hover:text-blue-500">Configurações</a></li>
                		    	    	        <li>
                		    	    	            <button 
                		    	    	                onClick={clienteSair}
                		    	    	                className="hover:text-blue-500"
                		    	    	            >
                		    	    	                Sign-out
                		    	    	            </button>
                		    	    	        </li>
                		    	    	    </ul>
                		    	    	</div>
                		    		</div>
								</>
							) : (
								<Link href="/login" className="flex gap-2 py-2 px-3 md:p-0 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-purple-600">
									<img src="/char.png" alt="" />Log-in
								</Link>
							)}
						</div>
					</div>

				</div>
			</nav>
		)

		
}

export default Header;