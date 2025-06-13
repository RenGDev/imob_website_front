import { ImovelItf } from "./ImovelItf";

export interface UserItf {
    id: number
    imoveis: ImovelItf[];

    name: string;
    cpf: string;
    phone: string;
    email: string;
    password: string;

    token: string;
}