import { ImovelItf } from "@/utils/types/ImovelItf";

export default function ImovIcons({data} : {data: ImovelItf}){
    const icones = [
      { cond: data.size, icon: "/size.png", label: `${data.size} m²` },
      { cond: data.bedRooms, icon: "/quarto.png", label: `${data.bedRooms} Quartos` },
      { cond: data.bathRooms, icon: "/8665909_shower_bathroom_icon.png", label: `${data.bathRooms} Banheiros` },
      { cond: data.parkinSpace, icon: "/car.png", label: `${data.parkinSpace} Vagas` }
    ];

    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 text-gray-500 text-sm">
        {icones.map((item, index) => item.cond && (
          <h2 key={index} className="inline-flex items-center gap-2">
            <img src={item.icon} alt={item.label} className="h-5" /> {item.label}
          </h2>
        ))}
      </div>
    );

}