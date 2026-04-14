import { api } from "./api";
import type { TApiResponse } from "../types";


const ENDPOINT = "auth";

export type AuthTokens = {
    accessToken: string;
    refreshToken?: string;
};

function unwrapContent<T>(raw: unknown): T {
    if (raw && typeof raw === "object" && "content" in (raw as any)) {
        return (raw as any).content as T;
    }
    return raw as T;
}

function getMessageFromAny(data: any) {
    const msg = data?.message;
    if (Array.isArray(msg)) return msg.join(", ");
    if (typeof msg === "string") return msg;
    return null;
}

export const AuthLogin = {
    login: async (payload: { email: string; password: string }): Promise<AuthTokens> => {
        try {
            const res = await api.post<TApiResponse<AuthTokens> | AuthTokens>(`${ENDPOINT}/login`, payload)
            const content = unwrapContent<AuthTokens>(res?.data)
            const accessToken = (content as any)?.accessToken
            if (typeof accessToken !== "string" || !accessToken) {
                throw new Error("Thiếu accessToken")
            }
            return content
        } catch (err: any) {
            const msg = getMessageFromAny(err?.response?.data)
            throw new Error(msg || err?.message || "Login failed")
        }
    },
    register: async (payload: { email: string; name: string; password: string }) => {
        try {
            const body = {
                email: payload.email,
                name: payload.name,
                password: payload.password,
            }
            const res = await api.post<TApiResponse<unknown> | unknown>(`${ENDPOINT}/register`, body)
            return unwrapContent<unknown>(res?.data)
        } catch (err: any) {
            const msg = getMessageFromAny(err?.response?.data)
            throw new Error(msg || err?.message || "Register failed")
        }
    }
}


