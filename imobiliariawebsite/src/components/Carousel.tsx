import { ImovelItf } from "@/utils/types/ImovelItf";
import 'flowbite';
import { useEffect } from "react";

export function Carousel({ imovel }: { imovel: ImovelItf }) {

    useEffect(() => {
        // Força o Flowbite a reprocessar os elementos com os data-attributes
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event("load"));
          }
        }, 0);
      }, [imovel]);

      const listaFotos = imovel?.photos.map((photo, index) => (
        <div
            key={photo.id}
            className={`duration-700 ease-in-out ${index === 0 ? '' : 'hidden'}`}
            data-carousel-item
          >
            <img
              src={photo.url}
              alt={photo.description}
              className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            />
          </div>
      ))

      const buttons = imovel.photos.map((_, index) => (
        <button
          key={index}
          type="button"
          className="w-3 h-3 rounded-full"
          aria-current={index === 0 ? 'true' : 'false'}
          aria-label={`Slide ${index + 1}`}
          data-carousel-slide-to={index}
        ></button>
      ))
      
  return (
    <div id="indicators-carousel" className="relative w-full" data-carousel="static">
      <div className="relative h-56 overflow-hidden md:h-96">
        {listaFotos}
      </div>

      <div className="absolute z-30 flex -translate-x-1/2 space-x-3 rtl:space-x-reverse bottom-5 left-1/2">
        {buttons}
      </div>

      <button
        type="button"
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        data-carousel-prev
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 6 10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 1 1 5l4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>

      <button
        type="button"
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        data-carousel-next
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 6 10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m1 9 4-4-4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
}