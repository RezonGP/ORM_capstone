'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Image } from '@/app/server/img'
import type { ImageItem } from '@/app/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function Page() {
    const [items, setItems] = useState<ImageItem[]>([])
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const loadAll = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await Image.getAll()
            setItems(Array.isArray(data) ? data : [])
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Request failed')
        } finally {
            setLoading(false)
        }
    }

    const onSearch = async () => {
        const q = query.trim()
        if (!q) {
            await loadAll()
            return
        }
        setLoading(true)
        setError(null)
        try {
            const data = await Image.searchByName(q)
            setItems(Array.isArray(data) ? data : [])
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Request failed')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void loadAll()
    }, [])

    return (
        <main className="mx-auto w-full max-w-7xl px-4 py-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Danh sách ảnh</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Tổng ảnh: {items.length}</p>
                </div>

                <div className="flex w-full max-w-xl items-center gap-2">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Tìm theo tên ảnh..."
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') void onSearch()
                        }}
                    />
                    <Button type="button" onClick={() => void onSearch()} disabled={loading}>
                        Tìm
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setQuery('')
                            void loadAll()
                        }}
                        disabled={loading}
                    >
                        Reset
                    </Button>
                </div>
            </div>

            {error ? <div className="mt-6 text-sm text-destructive">{error}</div> : null}
            {loading ? <div className="mt-6 text-sm text-muted-foreground">Đang tải...</div> : null}

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((img) => (
                    <Link key={img.id} href={`/images/${img.id}`} className="block">
                        <Card className="overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
                            <img src={img.url} alt={img.name} className="h-48 w-full object-cover" />
                            <CardHeader>
                                <CardTitle className="line-clamp-1">{img.name}</CardTitle>
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
        </main>
    )
}
