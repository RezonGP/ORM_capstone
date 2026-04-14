import { api } from "./api"
import type { MeUser } from "../types"

const ENDPOINT = "users"

function getMessageFromAny(data: any) {
  const msg = data?.message
  if (Array.isArray(msg)) return msg.join(", ")
  if (typeof msg === "string") return msg
  return null
}

export const UserService = {
  me: async (): Promise<MeUser> => {
    try {
      const res = await api.get(`/${ENDPOINT}/me`)
      return res.data as MeUser
    } catch (err: any) {
      const msg = getMessageFromAny(err?.response?.data)
      throw new Error(msg || err?.message || "Không lấy được thông tin user")
    }
  },
}

