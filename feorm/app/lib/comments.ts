import { API_URL } from './constants';
import type { CommentItem } from './types';

async function readErrorMessage(res: Response) {
  try {
    const data = await res.json();
    const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;
    return message || `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
}

export async function fetchCommentsByImage(imageId: number): Promise<CommentItem[]> {
  const res = await fetch(`${API_URL}/comments/image/${imageId}`);
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return (await res.json()) as CommentItem[];
}

export async function postComment(input: {
  imageId: number;
  content: string;
  accessToken: string;
}): Promise<CommentItem> {
  const res = await fetch(`${API_URL}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${input.accessToken}`,
    },
    body: JSON.stringify({ imageId: input.imageId, content: input.content }),
  });
  const data = await res.json();
  if (!res.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;
    throw new Error(message || `Request failed (${res.status})`);
  }
  return data as CommentItem;
}
