import { Review } from './review.model';

export interface Song {
    Reviews: Review[];
    Hidden: boolean;
    _id: string;
    Title: string;
    Artist: string;
    Album: string;
    Track: number;
    Year: number;
    Length: number;
    Genre: string;
    Rating: number;
    reviewCount: number;
}
