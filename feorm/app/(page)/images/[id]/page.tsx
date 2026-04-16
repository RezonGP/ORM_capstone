"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Image } from "@/app/server/img"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { CommentItem, ImageDetail } from "@/app/types"
import { CommentService } from "@/app/server/comment"
import { SavedService } from "@/app/server/saved"



export default function ImageDetailPage() {
    const params = useParams<{ id: string }>()
    const router = useRouter()
    const imageId = Number(params.id)

    const [data, setData] = useState<ImageDetail | null>(null)
    const [comments, setComments] = useState<CommentItem[]>([])
    const [saved, setSaved] = useState<boolean | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [content, setContent] = useState("")
    const [posting, setPosting] = useState(false)

    useEffect(() => {
        if (!Number.isFinite(imageId)) {
            setError("Id ảnh không hợp lệ")
            return
        }

        const run = async () => {
            setLoading(true)
            setError(null)
            try {
                const [img, cmt] = await Promise.all([
                    Image.getById(imageId),
                    CommentService.getByImage(imageId),
                ])
                setData(img)
                setComments(Array.isArray(cmt) ? cmt : [])

                const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
                if (token) {
                    try {
                        const ok = await SavedService.check(imageId)
                        setSaved(Boolean(ok))
                    } catch {
                        setSaved(null)
                    }
                } else {
                    setSaved(null)
                }
            } catch (e) {
                setError(e instanceof Error ? e.message : "Request failed")
            } finally {
                setLoading(false)
            }
        }

        void run()
    }, [imageId])

    if (loading) return <div className="p-6">Đang tải...</div>
    if (error) return <div className="p-6 text-destructive">{error}</div>
    if (!data) return null

    const onSave = async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
        if (!token) {
            router.push("/auth")
            return
        }
        setLoading(true)
        setError(null)
        try {
            await SavedService.save(imageId)
            setSaved(true)
        } catch (e) {
            setError(e instanceof Error ? e.message : "Request failed")
        } finally {
            setLoading(false)
        }
    }

    const onPost = async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
        if (!token) {
            router.push("/auth")
            return
        }
        const text = content.trim()
        if (!text) return

        setPosting(true)
        setError(null)
        try {
            const created = await CommentService.create({ imageId, content: text })
            setComments((prev) => [created, ...prev])
            setContent("")
        } catch (e) {
            setError(e instanceof Error ? e.message : "Request failed")
        } finally {
            setPosting(false)
        }
    }

    return (
        <main className="mx-auto w-full max-w-5xl px-4 py-10">
            <div className="flex items-center justify-between gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">Chi tiết ảnh</h1>
                <Button type="button" variant="outline" onClick={() => router.push("/images")}>
                    Quay lại
                </Button>
            </div>

            {error ? <div className="mt-6 text-sm text-destructive">{error}</div> : null}

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <img src={data.url} alt={data.name} className="h-[420px] w-full object-cover" />
                    <CardHeader className="flex flex-row items-start justify-between gap-3">
                        <div className="min-w-0">
                            <CardTitle className="line-clamp-1">{data.name}</CardTitle>
                            <div className="mt-1 text-sm text-muted-foreground line-clamp-1">
                                Người tạo: {data.user?.name || data.user?.email || "Không rõ"}
                            </div>
                        </div>
                        <Button
                            type="button"
                            onClick={() => void onSave()}
                            disabled={loading || saved === true}
                        >
                            {saved === true ? "Đã lưu" : "Lưu ảnh"}
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div>{data.description || "Không có mô tả"}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Bình luận</CardTitle>
                        <div className="text-sm text-muted-foreground">{comments.length} bình luận</div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Input
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Nhập bình luận..."
                                disabled={posting}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") void onPost()
                                }}
                            />
                            <Button type="button" onClick={() => void onPost()} disabled={posting || !content.trim()}>
                                Gửi
                            </Button>
                        </div>

                        <div className="max-h-[420px] space-y-3 overflow-auto pr-1">
                            {comments.map((c) => (
                                <div key={c.id} className="rounded-md border bg-muted/20 p-3">
                                    <div className="text-sm font-medium">
                                        {c.user?.name || c.user?.email || `User ${c.user_id}`}
                                    </div>
                                    <div className="mt-1 text-sm text-muted-foreground">{c.content}</div>
                                </div>
                            ))}

                            {comments.length === 0 ? (
                                <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
                                    Chưa có bình luận.
                                </div>
                            ) : null}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
