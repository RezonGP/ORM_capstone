import axios, { type InternalAxiosRequestConfig } from "axios";
import { BASE_URL } from "../common";


export const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    let accessToken = ""

    if (typeof window !== "undefined") {
        const raw = localStorage.getItem("accessToken");
        if (raw) {
            accessToken = raw;
        }
    }
    if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;

})
