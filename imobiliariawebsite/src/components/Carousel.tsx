import { ImovelItf } from "@/utils/types/ImovelItf";
import 'flowbite';
import { useEffect, useState } from "react";
import { useAuthStore } from '@/context/UserContext';
import { toast } from 'sonner';
import Modal from "@/components/PhotoRegisterModal";

export function Carousel({ imovel }: { imovel: ImovelItf }) {
    const [selectedPhoto, setSelectedPhoto] = useState(imovel.photos.find(photo => photo.isPrimary) || imovel.photos[0]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [photoToDelete, setPhotoToDelete] = useState<number | null>(null);
    const { user, token } = useAuthStore();

    useEffect(() => {
        setSelectedPhoto(imovel.photos.find(photo => photo.isPrimary) || imovel.photos[0]);
        setTimeout(() => {
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event("load"));
            }
        }, 0);
    }, [imovel]);

    const handleDeletePhoto = async () => {
        if (!photoToDelete) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/photos/${photoToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.success('Foto removida com sucesso');
               
                window.location.reload();
            } else {
                toast.error('Erro ao remover foto');
            }
        } catch (error) {
            toast.error('Erro na comunicação com o servidor');
        } finally {
            setShowDeleteModal(false);
            setPhotoToDelete(null);
        }
    };

    const listaFotos = imovel?.photos.map((photo) => (
        <div key={photo.id} className="relative group">
            <button
                onClick={() => setSelectedPhoto(photo)}
                className={`border-2 rounded-lg cursor-pointer transition-all duration-300 overflow-hidden w-full h-full ${
                    selectedPhoto?.id === photo.id ? 'border-amber-400' : 'border-transparent'
                }`}
            >
                <img
                    className="h-24 w-full object-cover"
                    src={photo.url}
                    alt={photo.description}
                />
            </button>
			{imovel?.user?.id == user?.id &&
				<button
                	onClick={(e) => {
                	    e.stopPropagation();
                	    setPhotoToDelete(photo.id);
                	    setShowDeleteModal(true);
                	}}
                	className="absolute top-1 right-1 cursor-pointer bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                	title="Excluir foto"
            	>
            	    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            	        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            	    </svg>
            	</button>
			}
            
        </div>
    ));

    return (
        <div className="flex flex-col gap-4 md:flex-row">
            <div>
                <img 
                    className="h-96 transition-all max-w-full rounded-lg" 
                    src={selectedPhoto?.url || "/no_image.jpg"} 
                    alt={selectedPhoto?.description || "Imagem"} 
                />
            </div>
            <div className="grid grid-cols-3 md:grid-cols-1 md:grid-rows-3 gap-4">
                {listaFotos}
            </div>

            <Modal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setPhotoToDelete(null);
                }}
                title="Confirmar exclusão"
                size="sm"
            >
                <div className="space-y-4">
                    <p>Tem certeza que deseja excluir esta foto?</p>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => {
                                setShowDeleteModal(false);
                                setPhotoToDelete(null);
                            }}
                            className="px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleDeletePhoto}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Excluir
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}