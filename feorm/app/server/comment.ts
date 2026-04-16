import { api } from "./api"
import type { CommentItem } from "../types"
import { getMessageFromAny } from "../common/getMessage"

const ENDPOINT = "comments"



export const CommentService = {
  getByImage: async (imageId: number): Promise<CommentItem[]> => {
    try {
      const res = await api.get(`/${ENDPOINT}/image/${imageId}`)
      return res.data as CommentItem[]
    } catch (err: any) {
      const msg = getMessageFromAny(err?.response?.data)
      throw new Error(msg || err?.message || "Không lấy được bình luận")
    }
  },
  create: async (payload: { imageId: number; content: string }): Promise<CommentItem> => {
    try {
      const res = await api.post(`/${ENDPOINT}`, payload)
      return res.data as CommentItem
    } catch (err: any) {
      const msg = getMessageFromAny(err?.response?.data)
      throw new Error(msg || err?.message || "Không gửi được bình luận")
    }
  },
}

