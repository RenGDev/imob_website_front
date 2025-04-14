import { CorretorItf } from "./CorretorItf";
import { UserItf } from "./UserItf";

export interface ImovelItf {
    id: number

    users: UserItf[];

    description: string;
    address: string;
    type: string;
    price: number;
    bedRooms: number;
    bathRooms: number;
    size: number;

    corretores: CorretorItf;
}