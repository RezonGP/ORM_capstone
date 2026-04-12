'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { fetchImages, searchImages } from '@/app/lib/images';
import type { ImageItem } from '@/app/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="h-48 w-full animate-pulse bg-muted/60" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted/60" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted/60" />
        <div className="mt-3 h-3 w-full animate-pulse rounded bg-muted/60" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-muted/60" />
      </div>
    </div>
  );
}

export default function ImagesHome() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const countText = useMemo(() => {
    const q = query.trim();
    if (q) return `Kết quả cho "${q}": ${items.length}`;
    return `Tổng ảnh: ${items.length}`;
  }, [items.length, query]);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchImages();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const onSearch = async () => {
    const q = query.trim();
    if (!q) {
      await loadAll();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await searchImages(q);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">
      <div className="rounded-2xl border bg-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Trang chủ</h1>
            <p className="mt-1 text-sm text-muted-foreground">{countText}</p>
          </div>

          <div className="flex w-full max-w-xl items-center gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo tên ảnh..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') void onSearch();
              }}
              aria-label="Search images"
            />
            <Button type="button" variant="default" onClick={() => void onSearch()} disabled={loading}>
              <Search className="mr-1 size-4" />
              Tìm
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setQuery('');
                void loadAll();
              }}
              disabled={loading}
            >
              <X className="mr-1 size-4" />
              Reset
            </Button>
          </div>
        </div>
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
            <Link key={img.id} href={`/images/${img.id}`} className="block">
              <Card className="overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="relative h-48 w-full bg-muted/30">
                  <img
                    src={img.url}
                    alt={img.name || `image-${img.id}`}
                    className="h-48 w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const el = e.currentTarget;
                      el.style.display = 'none';
                    }}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{img.name || 'Untitled'}</CardTitle>
                  <CardDescription className="line-clamp-1">
                    {img.user?.name || img.user?.email || 'Unknown user'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {img.description || 'Không có mô tả'}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {!loading && !error && items.length === 0 ? (
        <div className="mt-6 rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
          Không có ảnh nào.
        </div>
      ) : null}
    </div>
  );
}
