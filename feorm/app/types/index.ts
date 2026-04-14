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

