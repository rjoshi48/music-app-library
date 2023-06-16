import { User } from './user.model';

export interface Review {
    desc: string;
    rating: number;
    user_id: User;
    song_id: string;
}
