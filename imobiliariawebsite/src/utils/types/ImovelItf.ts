import { PhotoItf } from "./PhotoItf";
import { UserItf } from "./UserItf";

export interface ImovelItf {
    id: number

    users: UserItf[];
    user: UserItf;

    description: string;
    address: string;
    type: string;
    priceType: string;
    price: number;
    bedRooms: number;
    bathRooms: number;
    parkinSpace: number;
    size: number;

    photos: PhotoItf[]
}