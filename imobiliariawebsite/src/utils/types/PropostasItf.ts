import { JSX } from "react"
import { ImovelItf } from "./ImovelItf"
import { UserItf } from "./UserItf"

export interface PropostaItf {
    id: {
        userId: number,
        imovelId: number
    }
    user: UserItf
    imoveis: ImovelItf
}