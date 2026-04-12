'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, MessageSquareText, Send, ArrowLeft } from 'lucide-react';
import { fetchCommentsByImage, postComment } from '@/app/lib/comments';
import { fetchImageById } from '@/app/lib/images';
import { checkSavedByImage, saveImage } from '@/app/lib/saved';
import { getAccessToken } from '@/app/lib/auth';
import type { CommentItem, ImageItem } from '@/app/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

function formatDate(v?: string) {
  if (!v) return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString();
}

export default function ImageDetail({ id }: { id: string }) {
  const router = useRouter();
  const imageId = useMemo(() => Number(id), [id]);

  const [image, setImage] = useState<ImageItem | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [saved, setSaved] = useState<boolean | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);

  const load = async () => {
    if (!Number.isFinite(imageId)) {
      setError('Id ảnh không hợp lệ');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [img, cmts] = await Promise.all([fetchImageById(imageId), fetchCommentsByImage(imageId)]);
      setImage(img);
      setComments(Array.isArray(cmts) ? cmts : []);

      const token = getAccessToken();
      if (token) {
        try {
          const ok = await checkSavedByImage({ imageId, accessToken: token });
          setSaved(Boolean(ok));
        } catch {
          setSaved(null);
        }
      } else {
        setSaved(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [id]);

  const onSave = async () => {
    const token = getAccessToken();
    if (!token) {
      router.push('/auth');
      return;
    }
    if (!Number.isFinite(imageId)) return;

    setLoading(true);
    setError(null);
    try {
      await saveImage({ imageId, accessToken: token });
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const onPost = async () => {
    const token = getAccessToken();
    if (!token) {
      router.push('/auth');
      return;
    }
    const text = content.trim();
    if (!text) return;
    if (!Number.isFinite(imageId)) return;

    setPosting(true);
    setError(null);
    try {
      const created = await postComment({ imageId, content: text, accessToken: token });
      setComments((prev) => [created, ...prev]);
      setContent('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setPosting(false);
    }
  };

  if (loading && !image) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
        <div className="text-sm text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Chi tiết ảnh</h1>
          {image?.createdAt ? (
            <p className="mt-1 text-sm text-muted-foreground">Tạo lúc: {formatDate(image.createdAt) || image.createdAt}</p>
          ) : null}
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

      {image ? (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <div className="relative w-full overflow-hidden bg-muted/30">
              <img
                src={image.url}
                alt={image.name || `image-${image.id}`}
                className="h-[420px] w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const el = e.currentTarget;
                  el.style.display = 'none';
                }}
              />
              {!image.url ? (
                <div className="flex h-[420px] items-center justify-center text-sm text-muted-foreground">Không có ảnh</div>
              ) : null}
            </div>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-3">
                <span className="line-clamp-1">{image.name || 'Untitled'}</span>
                <Button type="button" variant="default" onClick={() => void onSave()} disabled={loading || saved === true}>
                  <Heart className="mr-1 size-4" />
                  {saved === true ? 'Đã lưu' : 'Save'}
                </Button>
              </CardTitle>
              <CardDescription className="line-clamp-1">
                Người tạo: {image.user?.name || image.user?.email || 'Unknown'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">{image.description || 'Không có mô tả'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquareText className="size-4" />
                Bình luận
              </CardTitle>
              <CardDescription>{comments.length} bình luận</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Nhập bình luận..."
                  disabled={posting}
                  aria-label="Comment content"
                />
              </div>
              <div className="flex items-center justify-end">
                <Button type="button" onClick={() => void onPost()} disabled={posting || !content.trim()}>
                  <Send className="mr-1 size-4" />
                  Gửi
                </Button>
              </div>

              <div className="max-h-[420px] space-y-3 overflow-auto pr-1">
                {comments.map((c) => (
                  <div key={c.id} className="rounded-lg border bg-muted/20 p-3">
                    <div className="text-sm font-medium">{c.user?.name || c.user?.email || `User ${c.user_id}`}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{c.content}</div>
                    {c.createdAt ? (
                      <div className="mt-1 text-xs text-muted-foreground">{formatDate(c.createdAt) || c.createdAt}</div>
                    ) : null}
                  </div>
                ))}

                {comments.length === 0 ? (
                  <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">Chưa có bình luận.</div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
