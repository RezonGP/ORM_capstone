'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, ArrowLeft } from 'lucide-react';
import { deleteImageById, fetchCreatedImages } from '@/app/lib/images';
import { getAccessToken } from '@/app/lib/auth';
import type { ImageItem } from '@/app/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="h-48 w-full animate-pulse bg-muted/60" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted/60" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-muted/60" />
        <div className="mt-3 h-8 w-1/2 animate-pulse rounded bg-muted/60" />
      </div>
    </div>
  );
}

export default function ImagesCreated() {
  const router = useRouter();
  const [items, setItems] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = async () => {
    const token = getAccessToken();
    if (!token) {
      router.push('/auth');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchCreatedImages(token);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onDelete = async (id: number) => {
    const token = getAccessToken();
    if (!token) {
      router.push('/auth');
      return;
    }
    if (!window.confirm('Bạn có chắc muốn xóa ảnh này không?')) return;

    setDeletingId(id);
    setError(null);
    try {
      await deleteImageById({ id, accessToken: token });
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ảnh đã tạo của tôi</h1>
          <p className="mt-1 text-sm text-muted-foreground">Tổng ảnh: {items.length}</p>
        </div>
        <Button type="button" variant="outline" onClick={() => router.push('/')}>
          <ArrowLeft className="mr-1 size-4" />
          Quay lại
        </Button>
      </div>

      {error ? (
        <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((img) => (
            <Card key={img.id} className="overflow-hidden">
              <Link href={`/images/${img.id}`} className="block">
                <img src={img.url} alt={img.name || `image-${img.id}`} className="h-48 w-full object-cover" loading="lazy" />
              </Link>
              <CardHeader>
                <CardTitle className="line-clamp-1">{img.name || 'Untitled'}</CardTitle>
                <CardDescription className="line-clamp-1">{img.description || 'Không có mô tả'}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-2">
                <Button type="button" variant="outline" asChild>
                  <Link href={`/images/${img.id}`}>Xem</Link>
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => void onDelete(img.id)}
                  disabled={deletingId === img.id}
                >
                  <Trash2 className="mr-1 size-4" />
                  {deletingId === img.id ? 'Đang xóa...' : 'Xóa'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && items.length === 0 ? (
        <div className="mt-6 rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">Bạn chưa tạo ảnh nào.</div>
      ) : null}
    </div>
  );
}
