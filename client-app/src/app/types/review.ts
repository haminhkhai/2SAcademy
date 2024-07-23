import { Artist } from "./artist";

export interface Review {
    id: string;
    artist: Artist;
    rating: number;
    content: string;
}