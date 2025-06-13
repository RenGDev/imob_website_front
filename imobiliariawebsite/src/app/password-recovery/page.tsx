'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useRouter } from "next/navigation"

type Step1 = { email: string }
type Step2 = { codigo: string; novaSenha: string }

export default function PasswordRecovery() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')

  const router = useRouter()

  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    reset: resetStep1,
  } = useForm<Step1>()

  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    reset: resetStep2,
  } = useForm<Step2>()

  async function enviarCodigo(data: Step1) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users/recover?email=${data.email}`, {
        method: 'PATCH',
      })

      if (response.ok) {
        toast.success('Código enviado ao seu e-mail!')
        setEmail(data.email)
        setStep(2)
        resetStep1()
      } else {
        toast.error('Erro ao enviar o código. Verifique o e-mail.')
      }
    } catch {
      toast.error('Erro de conexão ao enviar o código.')
    }
  }

  async function redefinirSenha(data: Step2) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          codigo: data.codigo,
          novaSenha: data.novaSenha,
        }),
      })

      if (response.ok) {
        toast.success('Senha redefinida com sucesso!')
        setStep(1)
        setEmail('')
        resetStep2()
        router.push("/login")
      } else {
        toast.error('Código inválido ou erro ao redefinir senha.')
      }
    } catch {
      toast.error('Erro de conexão ao redefinir senha.')
    }
  }

  return (
    <main className="flex flex-col md:flex-row min-h-screen">
      {/* Lado esquerdo */}
      <section className="flex flex-col items-center justify-center bg-amber-300 w-full md:w-1/2 py-20 px-6 text-center">
        <h1 className="text-5xl md:text-6xl text-white font-bold">Recuperar Senha</h1>
        <h2 className="text-lg md:text-2xl mt-4 text-white">Vamos te ajudar a redefinir</h2>
      </section>

      {/* Formulário */}
      <section className="flex flex-col items-center justify-center w-full md:w-1/2 py-10 px-6">
        <h1 className="text-3xl md:text-4xl text-amber-400 font-bold mb-6">
          {step === 1 ? 'Digite seu e-mail' : 'Redefina sua senha'}
        </h1>

        {step === 1 ? (
          <form onSubmit={handleSubmitStep1(enviarCodigo)} className="w-full max-w-sm flex flex-col gap-6">
            <div className="flex flex-col">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                required
                className="rounded-md px-3 py-2 border"
                {...registerStep1('email')}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg px-5 py-2.5"
            >
              Enviar Código
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmitStep2(redefinirSenha)} className="w-full max-w-sm flex flex-col gap-6">
            <div className="flex flex-col">
              <label htmlFor="codigo">Código recebido</label>
              <input
                id="codigo"
                type="text"
                required
                className="rounded-md px-3 py-2 border"
                {...registerStep2('codigo')}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="novaSenha">Nova senha</label>
              <input
                id="novaSenha"
                type="password"
                required
                className="rounded-md px-3 py-2 border"
                {...registerStep2('novaSenha')}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-5 py-2.5"
            >
              Redefinir Senha
            </button>
          </form>
        )}

        <p className="mt-6 text-sm text-center text-gray-600">
          Lembrou sua senha?{' '}
          <a href="/login" className="text-amber-700 font-medium hover:underline">
            Faça login
          </a>
        </p>
      </section>
    </main>
  )
}
