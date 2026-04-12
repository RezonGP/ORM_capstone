import { API_URL } from './constants';
import type { ImageItem } from './types';

async function readErrorMessage(res: Response) {
  try {
    const data = await res.json();
    const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;
    return message || `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
}

export async function fetchImages(): Promise<ImageItem[]> {
  const res = await fetch(`${API_URL}/images`);
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return (await res.json()) as ImageItem[];
}

export async function fetchImageById(id: number): Promise<ImageItem> {
  const res = await fetch(`${API_URL}/images/${id}`);
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return (await res.json()) as ImageItem;
}

export async function searchImages(name: string): Promise<ImageItem[]> {
  const q = name.trim();
  const res = await fetch(`${API_URL}/images/search?name=${encodeURIComponent(q)}`);
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return (await res.json()) as ImageItem[];
}

export async function fetchCreatedImages(accessToken: string): Promise<ImageItem[]> {
  const res = await fetch(`${API_URL}/images/created`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return (await res.json()) as ImageItem[];
}

export async function deleteImageById(input: { id: number; accessToken: string }) {
  const res = await fetch(`${API_URL}/images/${input.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${input.accessToken}` },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = Array.isArray((data as any)?.message) ? (data as any).message.join(', ') : (data as any)?.message;
    throw new Error(message || `Request failed (${res.status})`);
  }
  return data;
}
