import { api } from "./api"
import type { MeUser } from "../types"
import { getMessageFromAny, unwrapContent } from "../common/getMessage"

const ENDPOINT = "users"


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

