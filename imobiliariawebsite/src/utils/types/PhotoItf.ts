import { ImovelItf } from "@/utils/types/ImovelItf"

export interface PhotoItf {
    id: number
    description: string
    imovelId: number
    url: string
    isPrimary: boolean
    imovel: ImovelItf
}