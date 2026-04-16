import { api } from "./api";
import type { CreateMe, ImageDetail, ImageItem, TApiResponse } from "../types";
import { unwrapContent } from "../common/getMessage"



const ENDPOINT = "images";



export const Image = {
    getAll: async (): Promise<ImageItem[]> => {
        const res = await api.get<TApiResponse<ImageItem[]> | ImageItem[]>(`/${ENDPOINT}`);
        return unwrapContent<ImageItem[]>(res.data);
    },
    searchByName: async (name: string): Promise<ImageItem[]> => {
        const res = await api.get<TApiResponse<ImageItem[]> | ImageItem[]>(`/${ENDPOINT}/search`, {
            params: { name },
        });
        return unwrapContent<ImageItem[]>(res.data);
    },
    getById: async (id: number): Promise<ImageDetail> => {
        const res = await api.get<TApiResponse<ImageDetail> | ImageDetail>(`/${ENDPOINT}/${id}`);
        return unwrapContent<ImageDetail>(res.data);
    },
    getCreated: async (): Promise<CreateMe[]> => {
        const res = await api.get<TApiResponse<CreateMe[]> | CreateMe[]>(`/${ENDPOINT}/created`);
        return unwrapContent<CreateMe[]>(res.data);
    },
    deleteCreated: async (id: number): Promise<unknown> => {
        const res = await api.delete(`/${ENDPOINT}/${id}`);
        return unwrapContent<unknown>(res.data);
    }
}
