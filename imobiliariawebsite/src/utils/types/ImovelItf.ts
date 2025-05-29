import { CorretorItf } from "./CorretorItf";
import { PhotoItf } from "./PhotoItf";
import { UserItf } from "./UserItf";

export interface ImovelItf {
    id: number

    users: UserItf[];

    description: string;
    address: string;
    type: string;
    photo: string;
    price: number;
    bedRooms: number;
    bathRooms: number;
    size: number;

    photos: PhotoItf[]

    corretores: CorretorItf;
}