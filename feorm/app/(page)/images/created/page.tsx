"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react";
import { CreateMe } from "@/app/types";
import { useRouter } from "next/navigation";
import { Image } from "@/app/server/img";
import { getMessageFromAny } from "@/app/common/getMessage";

export default function Page() {
    const router = useRouter();
    const [items, setItems] = useState<CreateMe[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadCreated = async () => {
        if (typeof window === "undefined") return;
        const token = window.localStorage.getItem("accessToken");
        if (!token) {
            return router.push("/auth");
        }
        setLoading(true);
        setError(null);
        try {
            const data = await Image.getCreated();
            setItems(Array.isArray(data) ? data : []);
        } catch (error) {
            setError(getMessageFromAny((error as any)?.response?.data) || (error instanceof Error ? error.message : "Lỗi không xác định"));
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async (id: number) => {
        if (typeof window === "undefined") return;
        const token = window.localStorage.getItem("accessToken");
        if (!token) {
            router.push("/auth");
            return;
        }
        if (!window.confirm("Bạn có chắc muốn xóa ảnh này không?")) return;

        setDeletingId(id);
        setError(null);
        try {
            await Image.deleteCreated(id);
            setItems((prev) => prev.filter((x) => x.id !== id));
        } catch (error) {
            setError(getMessageFromAny((error as any)?.response?.data) || (error instanceof Error ? error.message : "Lỗi không xác định"));
        } finally {
            setDeletingId(null);
        }
    }
    useEffect(() => {
        void loadCreated();
    }, []);




    return (
        <main className="mx-auto w-full max-w-7xl px-4 py-10">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Ảnh đã tạo</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Tổng ảnh: {items.length}</p>
                </div>
                <Button type="button" variant="outline" asChild>
                    <Link href="/images">Danh sách ảnh</Link>
                </Button>
            </div>

            {error ? <div className="mt-6 text-sm text-destructive">{error}</div> : null}
            {loading ? <div className="mt-6 text-sm text-muted-foreground">Đang tải...</div> : null}

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((img) => (
                    <Card key={img.id} className="overflow-hidden">
                        <Link href={`/images/${img.id}`} className="block">
                            <img src={img.url || ""} alt={img.name || ""} className="h-48 w-full object-cover" />
                        </Link>
                        <CardHeader>
                            <CardTitle className="line-clamp-1">{img.name || ""}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="text-sm text-muted-foreground line-clamp-2">
                                {img.description || "Không có mô tả"}
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <Button type="button" variant="outline" asChild>
                                    <Link href={`/images/${img.id}`}>Xem</Link>
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => void onDelete(img.id)}
                                    disabled={deletingId === img.id}
                                >
                                    {deletingId === img.id ? "Đang xóa..." : "Xóa"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {items.length === 0 ? (
                <div className="mt-6 rounded-md border bg-muted/20 p-4 text-sm text-muted-foreground">
                    Chưa có ảnh nào.
                </div>
            ) : null}
        </main>
    )
}
