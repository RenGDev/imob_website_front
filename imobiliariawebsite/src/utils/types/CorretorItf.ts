import { ImovelItf } from "./ImovelItf";

export interface CorretorItf {
    id: number
    imoveis: ImovelItf[];

    name: string;
    cpf: string;
    phone: string;
    email: string;
    password: string;
    crecii: string;

}