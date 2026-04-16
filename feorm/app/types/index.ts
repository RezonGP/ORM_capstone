import { AxiosError } from "axios";


export type InitState<T> = {
    loading: boolean;
    data: T | null;
    error: AxiosError<unknown> | null;
}

export type TApiResponse<T> = {
    statusCode: number;
    message: string;
    content: T;
}

export type User = {
    id: number;
    email: string;
    name: string;
    password: string;
}

export type ImageItem = {
    id: number;
    name: string;
    url: string;
    description?: string | null;
};
export type MeUser = {
    id: number
    name: string | null
    email: string
}

export type ImageDetail = {
    id: number
    name: string
    url: string
    description?: string | null
    user?: { id: number; name: string | null; email: string }
}

export type CommentItem = {
    id: number
    content: string
    user_id: number
    image_id: number
    createdAt?: string
    user?: { id: number; name: string | null; email: string }
}

export type SavedItem = {
    id: number
    user_id: number
    image_id: number
    createdAt?: string
    image?: ImageItem | null
}

export type CreateMe = {
    id: number
    name: string | null
    description?: string | null
    image?: ImageItem | null
    url?: string | null
    createdAt?: string
}