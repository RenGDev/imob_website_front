import { ImovelItf } from "./ImovelItf";

export interface UserItf {
    id: number
    imoveis: ImovelItf[];
    myImoveis: ImovelItf[];

    name: string;
    cpf: string;
    phone: string;
    email: string;
    password: string;
    role: string;
    
    token: string;
}