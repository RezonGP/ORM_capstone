"use client";


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SavedItem } from "../types";
import { SavedService } from "../server/saved";
import { getMessageFromAny } from "../common/getMessage";
import { useRouter } from "next/navigation";

export default function SavedPage() {
  const router = useRouter();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadSaved = async () => {
    if (typeof window === "undefined") return;
    const token = window.localStorage.getItem("accessToken");
    if (!token) {
      return router.push("/auth");
    }
    setLoading(true);
    setError(null);
    try {
      const data = await SavedService.me();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(getMessageFromAny(error));
    } finally {
      setLoading(false);
    }

  }

  useEffect(() => {
    void loadSaved();
  }, []);



  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ảnh đã lưu</h1>
          <p className="mt-1 text-sm text-muted-foreground">Tổng ảnh: {items.length || 0}</p>
        </div>
        <Button type="button" variant="outline" onClick={() => router.push("/images")}>
          Danh sách ảnh
        </Button>
      </div>

      {error ? <div className="mt-6 text-sm text-destructive">{error}</div> : null}
      {loading ? <div className="mt-6 text-sm text-muted-foreground">Đang tải...</div> : null}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <Link key={s.id} href={s.image_id ? `/images/${s.image_id}` : "/images"} className="block">
            <Card className="overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
              {s.image?.url ? (
                <img src={s.image.url} alt={s.image?.name || `image-${s.image_id}`} className="h-48 w-full object-cover" />
              ) : (
                <div className="flex h-48 w-full items-center justify-center bg-muted/30 text-sm text-muted-foreground">
                  Không có ảnh
                </div>
              )}
              <CardHeader>
                <CardTitle className="line-clamp-1">{s.image?.name || `Ảnh #${s.image_id}`}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground line-clamp-2">{s.image?.description || "Không có mô tả"}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {!loading && !error && items.length === 0 ? (
        <div className="mt-6 rounded-md border bg-muted/20 p-4 text-sm text-muted-foreground">
          Bạn chưa lưu ảnh nào.
        </div>
      ) : null}
    </main>
  )
}
