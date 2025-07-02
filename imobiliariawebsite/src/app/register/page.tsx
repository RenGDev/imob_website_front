'use client'
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type Inputs = {
  name: string;
  cpf: string;
  phone: string;
  email: string;
  password: string;
}

export default function Register() {
  const { register, handleSubmit, reset } = useForm<Inputs>()
  const router = useRouter()

  async function registrar(data: Inputs) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users/register`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(data),
    })

    if (response.status == 200) {
      toast.success("Registrado com sucesso")
      reset()
      router.push("/login")
    } else {
      toast.error("Erro... Não foi possível realizar seu cadastro")
    }
  }

  return (
    <main className="flex flex-col md:flex-row min-h-screen">
      
      <section className="flex flex-col items-center justify-center bg-amber-300 w-full md:w-1/2 py-20 px-6 text-center">
        <h1 className="text-5xl md:text-6xl text-white font-bold">Bem-vindo!</h1>
        <h2 className="text-lg md:text-2xl mt-4 text-white">Escolha os melhores imóveis da sua região</h2>
      </section>

      <section className="flex flex-col items-center justify-center w-full md:w-1/2 py-10 px-6">
        <h1 className="text-3xl md:text-5xl text-amber-300 font-bold mb-6">Registre-se</h1>
        <form
          onSubmit={handleSubmit(registrar)}
          className="w-full max-w-xl mt-3 flex flex-col gap-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col w-full">
              <label htmlFor="name">Nome Completo</label>
              <input className="rounded-md px-3 w-64 py-2 border" type="text" id="name" required {...register("name")} />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="cpf">CPF</label>
              <input className="rounded-md px-3 w-64 py-2 border" type="text" id="cpf" required {...register("cpf")} />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col w-full">
              <label htmlFor="tel">Telefone</label>
              <input className="rounded-md px-3 w-64 py-2 border" type="tel" id="tel" required {...register("phone")} />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="email">E-mail</label>
              <input className="rounded-md px-3 w-64 py-2 border" type="email" id="email" required {...register("email")} />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="password">Senha</label>
            <input className="rounded-md mb-14 w-64 px-3 py-2 border" type="password" id="password" required {...register("password")} />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Registrar
          </button>

          <p className="text-sm font-light text-center text-black">
            Já possui conta?{" "}
            <a href="/login" className="font-medium text-amber-700 hover:underline">
              Log-in
            </a>
          </p>
        </form>
      </section>
    </main>
  )
}
