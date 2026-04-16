import { api } from "./api"
import { SavedItem } from "../types"
import { getMessageFromAny, unwrapContent } from "../common/getMessage"


const ENDPOINT = "saved"

export const SavedService = {
  me: async (): Promise<SavedItem[]> => {
    try {
      const res = await api.get(`/${ENDPOINT}/me`)
      return unwrapContent(res.data)
    } catch (err: any) {
      const msg = getMessageFromAny(err?.response?.data)
      throw new Error(msg || err?.message || "Không lấy được danh sách ảnh đã lưu")
    }
  },
  check: async (imageId: number): Promise<boolean> => {
    try {
      const res = await api.get(`/${ENDPOINT}/check/${imageId}`)
      return Boolean(res.data)
    } catch (err: any) {
      const msg = getMessageFromAny(err?.response?.data)
      throw new Error(msg || err?.message || "Không kiểm tra được trạng thái lưu")
    }
  },
  save: async (imageId: number) => {
    try {
      const res = await api.post(`/${ENDPOINT}`, { imageId })
      return res.data
    } catch (err: any) {
      const msg = getMessageFromAny(err?.response?.data)
      throw new Error(msg || err?.message || "Không lưu được ảnh")
    }
  },
}

