export function getMessageFromAny(data: any) {
    const msg = data?.message
    if (Array.isArray(msg)) return msg.join(", ")
    if (typeof msg === "string") return msg
    return null
}
export function unwrapContent<T>(raw: unknown): T {
    if (raw && typeof raw === "object" && "content" in (raw as any)) {
        return (raw as any).content as T;
    }
    return raw as T;
}