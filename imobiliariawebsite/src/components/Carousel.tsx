import { ImovelItf } from "@/utils/types/ImovelItf";
import 'flowbite';
import { useEffect, useState } from "react";

export function Carousel({ imovel }: { imovel: ImovelItf }) {

	const [selectedPhoto, setSelectedPhoto] = useState(imovel.photos.find(photo => photo.isPrimary) || imovel.photos[0]);

	useEffect(() => {
			// Força o Flowbite a reprocessar os elementos com os data-attributes
			setSelectedPhoto(imovel.photos.find(photo => photo.isPrimary) || imovel.photos[0])
			setTimeout(() => {
				if (typeof window !== 'undefined') {
					window.dispatchEvent(new Event("load"));
				}
			}, 0);
		}, [imovel]);

		const listaFotos = imovel?.photos.map((photo) => (
			<button
      		  key={photo.id}
      		  onClick={() => setSelectedPhoto(photo)}
      		  className={`border-2 rounded-lg overflow-hidden ${selectedPhoto.id === photo.id ? 'border-amber-400' : 'border-transparent'}`}
      		>
      		  	<img
      		  	  className="h-24 w-full object-cover"
      		  	  src={photo.url}
      		  	  alt={photo.description}
      		  	/>
      		</button>
	))

			
	return (
			<div className="flex gap-4">
					<div>
						<img className="h-96 max-w-full rounded-lg" src={selectedPhoto?.url || "/no_image.jpg"} alt={selectedPhoto?.description || "Imagem"} />
					</div>
					<div className="grid grid-cols-1 grid-rows-3 gap-4">
						{listaFotos}
					</div>
			</div>

	);
}