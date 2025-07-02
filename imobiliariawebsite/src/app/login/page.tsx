'use client'
import { useAuthStore } from "@/context/UserContext"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

    type Inputs = {
        email: string
        password: string
        manter: boolean
    }
    
export default function Login() {
    const { register, handleSubmit } = useForm<Inputs>()    
    const { signIn } = useAuthStore()

    const router = useRouter()

    async function verificaLogin(data: Inputs) {
        // alert(`${data.email} ${data.senha} ${data.manter}`)
        const response = await 
          fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/login`, {
            headers: {"Content-Type": "application/json"},
            method: "POST",
            mode: "cors",
            body: JSON.stringify({ email: data.email, password: data.password })
          })
        
        // console.log(response)
        if (response.status == 200) {
            // toast.success("Ok!")            
            const {user, token} = await response.json()


            // "coloca" os dados do cliente no contexto
            signIn(user, token)

            console.log(user)
            
            // se o cliente indicou que quer se manter conectado
            // salvamos os dados (id) dele em localStorage
            if (data.manter) {
                localStorage.setItem("clienteKey", user.id)
            } else {
                // se indicou que não quer permanecer logado e tem
                // uma chave (anteriormente) salva, remove-a
                if (localStorage.getItem("clienteKey")) {
                    localStorage.removeItem("clienteKey")
                }
            }

            // carrega a página principal, após login do cliente
            router.push("/")
        } else {
            toast.error("Erro... Login ou senha incorretos")
        }
    }
    return(
        <main className="flex">
            <section className="md:flex flex-col hidden items-center bg-amber-300 h-dvh w-3/5">
                <h1 className="mt-56 text-7xl text-white">Bem vindo!</h1>
                <h2 className="text-2xl mt-3 text-gray-100">Venha escolher os melhores imoveis da sua região</h2>
            </section>

            <section className="flex flex-col justify-center h-dvh md:w-2/5 sm:w-full">
                <h1 className="mx-auto text-5xl text-amber-300 font-bold">Login</h1>
                <form className="px-28 py-10 flex flex-col gap-8" onSubmit={handleSubmit(verificaLogin)}>
                    <div className="flex flex-col">
                        <label htmlFor="email">E-mail</label>
                        <input className="rounded-md"
                            type="email"  
                            id="email" 
                            required 
                            {...register("email")}/>
                    </div>                    
                    <div className="flex flex-col">
                        <label htmlFor="password">Senha</label>
                        <input className="rounded-md"
                            type="password"
                            id="password" 
                            required 
                            {...register("password")}/>
                    </div>
                    <div className="flex items-center justify-between">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="remember" 
                                           aria-describedby="remember" type="checkbox" 
                                           className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" 
                                           {...register("manter")} />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="remember" className="text-black dark:text-black">Manter Conectado</label>
                                </div>
                            </div>
                            <a href="/password-recovery" className="text-sm font-medium text-black hover:underline dark:text-black">Esqueceu sua senha?</a>
                    </div>
                    <button type="submit" className="w-full text-white focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-amber-600 hover:bg-amber-700 dark:focus:ring-blue-800">
                        Entrar
                    </button>
                    <p className="text-sm font-light text-black">
                        Ainda não possui conta? <a href="/register" className="font-medium text-black-600 hover:underline">Cadastre-se</a>
                    </p>
                </form>
            </section>
        </main>
    )
}