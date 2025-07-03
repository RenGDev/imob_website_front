"use client"
import { Carousel } from "@/components/Carousel";
import { ImovelItf } from "@/utils/types/ImovelItf";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import { useAuthStore } from '@/context/UserContext'
import ImovIcons from "@/components/ImovIcons";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import RatingStars from "@/components/RatingStars";
import Modal from "@/components/PhotoRegisterModal";


type Inputs = {
    url: string
    description: string
    isPrimary: boolean
}

export default function Detalhes() {
  const { user, token } = useAuthStore()

  const params = useParams()
  const id = params.imovel_id

  const [isOpen, setIsOpen] = useState(false);

  const [imoveis, setImoveis] = useState<ImovelItf>()
  const [mediaRating, setMediaRating] = useState<number | null>(null)

  const { register, handleSubmit, reset } = useForm<Inputs>()

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/imoveis/list/${id}`)
      const dados = await response.json()
      setImoveis(dados)
    }

    if (!id || !token) return;

    async function buscaMedia() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/ratings/media/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (response.ok) {
          const media = await response.json()
          setMediaRating(media)
        }
      } catch (error) {
        console.error("Erro ao buscar média de avaliação:", error)
      }
    }

    buscaMedia()
    buscaDados()    
  }, [id, token])


  async function uploadPhoto(data: Inputs) {
    const fileInput = document.getElementById('input_file') as HTMLInputElement;
    
    if (!fileInput?.files?.length) {
      toast.error("Por favor, selecione um arquivo");
      return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();

    formData.append('file', file);
    formData.append('description', data.description);
    formData.append('isPrimary', String(data.isPrimary || false));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/photos/upload/${id}`, {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success("Foto enviada com sucesso");
        reset();
        setIsOpen(false);

        const updatedResponse = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/imoveis/list/${id}`);
        const updatedData = await updatedResponse.json();
        setImoveis(updatedData);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Erro ao enviar foto");
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error("Erro na comunicação com o servidor");
    }
  }

  async function enviaProposta() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/user_imovel/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user?.id,
          imovelId: Number(params.imovel_id),
        })
      })

      if (response.ok) {
        toast.success("Proposta enviada com sucesso")
      } else {
        toast.error("Erro... Não foi possível enviar sua proposta")
      }
    } catch (error) {
      toast.error("Erro na comunicação com o servidor")
    }
  }

  return (
    <main className="bg-white">
      <section className="mt-6 md:mt-10 w-full px-4 sm:px-6 lg:px-8 xl:px-20">
        {imoveis?.photos && (
          <div className="flex flex-col gap-4">
            <Carousel key={imoveis.id} imovel={imoveis}/>
            {imoveis?.user?.id == user?.id &&(
              <>
                <button onClick={() => setIsOpen(true)} className="bg-black transition-all hover:ring-black hover:ring-2 focus:bg-amber-400 hover:bg-amber-300 w-15 h-15 rounded-full cursor-pointer">
                  <svg className="w-6 h-6 m-auto text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                  </svg>
                </button>
                <Modal
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                  title="Adicionar Nova Foto"
                  size="lg"
                >
                  <div className="space-y-6">
                    <form onSubmit={handleSubmit(uploadPhoto)} className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-800 mb-2">
                          Selecione a Foto
                        </label>

                        <div className="flex items-center justify-center w-full">
                          <label 
                            htmlFor="input_file"
                            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-amber-300 rounded-lg cursor-pointer bg-amber-50 hover:bg-amber-100 transition-colors duration-200"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                              <svg className="w-10 h-10 mb-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              <p className="mb-2 text-sm text-gray-600">
                                <span className="font-semibold">Clique para selecionar</span> ou arraste uma imagem
                              </p>
                              <p className="text-xs text-gray-500">
                                Formatos suportados: JPG, PNG (Máx. 5MB)
                              </p>
                            </div>
                            <input 
                              id="input_file" 
                              type="file" 
                              className="hidden" 
                              accept="image/jpeg,image/png"
                              required 
                              {...register("url")}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="input_description" className="block text-lg font-semibold text-gray-800 mb-2">
                          Descrição da Foto
                        </label>
                        <textarea
                          id="input_description"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                          rows={3}
                          placeholder="Ex: Sala de estar com vista para o jardim"
                          required 
                          {...register("description")}
                        />
                      </div>
                      <div className="flex items-center">
                        <input 
                          id="isPrimary" 
                          type="checkbox" 
                          className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500 border-gray-300"
                          {...register("isPrimary")}
                        />
                        <label htmlFor="isPrimary" className="ml-3 text-lg font-medium text-gray-700">
                          Definir como foto principal
                        </label>
                      </div>
                      <div className="flex justify-end gap-4 pt-4">
                        <button
                          type="button"
                          onClick={() => setIsOpen(false)}
                          className="px-6 py-3 text-lg font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-3 text-lg font-medium bg-amber-400 text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
                        >
                          Enviar Foto
                        </button>
                      </div>
                    </form>
                  </div>
                </Modal>
              </>
            )
            }
          </div>
        )}
      </section>

      <section className="pb-16">
        <div className="flex flex-col gap-6 px-4 sm:px-6 lg:px-8 xl:px-20 py-8 md:py-16">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-chart-4">
            {imoveis?.description} - ({imoveis?.type})
          </h1>

          <div className="flex flex-col gap-8 ml-0 md:ml-5">
            <div className="flex flex-col md:flex-row gap-6 md:gap-16"> 
              <div className="flex-1">
                <h2 className="text-sm md:text-base text-gray-500">Valor</h2>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {Number(imoveis?.price).toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL"
                  })}
                </h1>
              </div>
              
              <div className="flex-1">
                <h2 className="text-sm md:text-base text-gray-500">Endereço</h2>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
                  {imoveis?.address}
                </h1>
              </div>
              
              {mediaRating !== null && (
                <div className="flex-1">
                  <h2 className="text-sm md:text-base text-gray-500">Avaliação média</h2>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {mediaRating.toFixed(1)} ★
                  </h1>
                </div>
              )}
            </div>
            
            {imoveis && <ImovIcons key={imoveis.id} data={imoveis} />}

            {imoveis?.user?.id != user?.id &&(
              <>
                  {user?.id  ? (
                    <div className="mt-4">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900">
                        Você pode fazer uma proposta para este imóvel!
                      </h3>
                      <form onSubmit={handleSubmit(enviaProposta)} className="mt-4 max-w-md">
                        <input 
                          type="text" 
                          className="mb-4 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" 
                          value={`${user.name} (${user.email})`} 
                          disabled 
                          readOnly 
                        />

                        <button 
                          type="submit" 
                          className="text-white bg-blue-700 cursor-pointer hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center transition-colors duration-200"
                        >
                          Enviar Proposta
                        </button>
                      </form>
                    </div>
                  ) : (
                    <h2 className="text-lg md:text-xl text-amber-500 font-medium mt-4">
                      Gostou do imóvel? Faça login na sua conta para enviar uma proposta
                    </h2>
                  )}


                  <div className="mt-8">
                    <h3 className="text-lg md:text-xl font-semibold mb-4">Avalie este imóvel:</h3>
                    <RatingStars
                      onRate={async (rating) => {
                        if (!user?.id) {
                          toast.error("Você precisa estar logado para avaliar");
                          return;
                        }
                        try {
                          const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/ratings/rate`, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                              score: rating,
                              user: { id: user?.id },
                              imovel: { id: Number(id) }
                            })
                          });
                        
                          if (res.ok) {
                            toast.success("Avaliação enviada com sucesso!");
                            window.location.reload();
                          } else {
                            toast.error("Erro ao enviar avaliação. Você já avaliou?");
                          }
                        } catch (error) {
                          toast.error("Erro na comunicação com o servidor");
                        }
                      }}
                    />
                  </div>
              </>
            )
            }
          </div>
        </div>      
      </section>
    </main>
  )
}