'use client'

import { useAuthStore } from '@/context/UserContext'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

function Header() {
    const { user, signOut, token } = useAuthStore()
    const router = useRouter()
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const mobileMenuRef = useRef<HTMLDivElement>(null)
    
    // Fechar menus ao clicar fora
    useEffect(() => {
		if (!token){
			signOut()
		}
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setMobileMenuOpen(false)
            }
        }
    
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleLogout = () => {
        if (confirm("Tem certeza que deseja sair do sistema?")) {
            signOut()
            localStorage.removeItem("clienteKey")
            router.push("/login")
        }
    }

    // Verifica se a rota está ativa
    const isActive = (route: string) => pathname === route

    return (
        <header className="bg-amber-300 shadow-md">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clipRule="evenodd"/>
                        </svg>
                        <span className="text-xl font-bold text-gray-800">LQ Imóveis</span>
                    </Link>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-md text-gray-700 hover:bg-amber-500 focus:outline-none"
                            aria-label="Abrir menu"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Right Side - Navigation and User Actions (Desktop) */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Navigation Links */}
                        <nav className="flex items-center space-x-6">
                            <Link 
                                href="/todos" 
                                className={`${isActive('/todos') ? 'text-purple-900 font-bold' : 'text-purple-700'} hover:text-purple-800 transition-colors`}
                            >
                                Imóveis
                            </Link>
                            <Link 
                                href="/register-imovel" 
                                className={`${isActive('/register-imovel') ? 'text-purple-900 font-bold' : 'text-purple-700'} hover:text-purple-800 transition-colors`}
                            >
                                Anunciar
                            </Link>
                        </nav>

                        {/* Separator */}
                        <div className="h-6 w-px bg-gray-300"></div>

                        {/* User Actions */}
                        {user?.id ? (
                            <div className="relative" ref={menuRef}>
                                <button 
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="flex items-center justify-center h-9 w-9 rounded-full border-2 border-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    aria-label="Menu do usuário"
                                    aria-expanded={isOpen}
                                >
                                    <img 
                                        src={"/user-avatar.png"} 
                                        alt={`Avatar de ${user.name}`} 
                                        className="h-full w-full rounded-full object-cover"
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                <div 
                                    className={`absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 ${isOpen ? 'block' : 'hidden'}`}
                                    role="menu"
                                >
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    
                                    <div className="py-1">
                                        {user.role === "ADMIN" && (
                                            <Link 
                                                href="/admin/estatisticas" 
                                                className={`block px-4 py-2 text-sm ${isActive('/admin/estatisticas') ? 'bg-amber-100 text-amber-900' : 'text-gray-700 hover:bg-gray-100'}`}
                                                role="menuitem"
                                            >
                                                Estatísticas
                                            </Link>
                                        )}
                                        <Link 
                                            href="/meus-imoveis" 
                                            className={`block px-4 py-2 text-sm ${isActive('/meus-imoveis') ? 'bg-amber-100 text-amber-900' : 'text-gray-700 hover:bg-gray-100'}`}
                                            role="menuitem"
                                        >
                                            Meus imóveis
                                        </Link>
                                        <Link 
                                            href="/propostas" 
                                            className={`block px-4 py-2 text-sm ${isActive('/propostas') ? 'bg-amber-100 text-amber-900' : 'text-gray-700 hover:bg-gray-100'}`}
                                            role="menuitem"
                                        >
                                            Minhas propostas
                                        </Link>
                                        <Link 
                                            href="/configuracoes" 
                                            className={`block px-4 py-2 text-sm ${isActive('/configuracoes') ? 'bg-amber-100 text-amber-900' : 'text-gray-700 hover:bg-gray-100'}`}
                                            role="menuitem"
                                        >
                                            Configurações
                                        </Link>
                                    </div>
                                    
                                    <div className="py-1 border-t border-gray-100">
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            role="menuitem"
                                        >
                                            Sair
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link 
                                href="/login" 
                                className="flex items-center space-x-2 px-3 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                            >
                                <img src="/char.png" alt="" className="h-5 w-5" />
                                <span>Entrar</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div 
                ref={mobileMenuRef}
                className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-white shadow-lg`}
            >
                {/* User Info in Mobile Menu */}
                {user?.id && (
                    <div className="px-4 py-3 border-b border-gray-200 flex items-center space-x-3">
                        <img 
                            src={"/user-avatar.png"} 
                            alt={`Avatar de ${user.name}`} 
                            className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                    </div>
                )}

                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link 
                        href="/todos" 
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/todos') ? 'bg-amber-100 text-amber-900' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        Imóveis
                    </Link>
                    <Link 
                        href="/register-imovel" 
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/register-imovel') ? 'bg-amber-100 text-amber-900' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        Anunciar
                    </Link>
                    
                    {user?.id && (
                        <>
                            {user.role === "ADMIN" && (
                                <Link 
                                    href="/admin/estatisticas" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/admin/estatisticas') ? 'bg-amber-100 text-amber-900' : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                    Estatísticas
                                </Link>
                            )}
                            <Link 
                                href="/meus-imoveis" 
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/meus-imoveis') ? 'bg-amber-100 text-amber-900' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                Meus imóveis
                            </Link>
                            <Link 
                                href="/propostas" 
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/propostas') ? 'bg-amber-100 text-amber-900' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                Minhas propostas
                            </Link>
                            <Link 
                                href="/configuracoes" 
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/configuracoes') ? 'bg-amber-100 text-amber-900' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                Configurações
                            </Link>
                            <button
                                onClick={() => {
                                    handleLogout()
                                    setMobileMenuOpen(false)
                                }}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                            >
                                Sair
                            </button>
                        </>
                    )}
                    
                    {!user?.id && (
                        <Link 
                            href="/login" 
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium text-white bg-purple-600 hover:bg-purple-700"
                        >
                            Entrar
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header