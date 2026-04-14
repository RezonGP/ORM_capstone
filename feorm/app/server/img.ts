import { api } from "./api";
import { TApiResponse } from "../types";

const ENDPOINT = "images";

export const Image = {
    getAll: async () => {
        const res = await api.get<TApiResponse<any>>(`${ENDPOINT}`);
        return res.data;
    },
    searchByName: async (name: string) => {
        const res = await api.get<TApiResponse<any>>(`${ENDPOINT}/search`, {
            params: {
                name
            }
        });
        return res.data;
    },
}