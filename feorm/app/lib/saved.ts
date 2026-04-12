import { API_URL } from './constants';

async function readErrorMessage(res: Response) {
  try {
    const data = await res.json();
    const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;
    return message || `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
}

export async function checkSavedByImage(input: { imageId: number; accessToken: string }): Promise<boolean> {
  const res = await fetch(`${API_URL}/saved/check/${input.imageId}`, {
    headers: { Authorization: `Bearer ${input.accessToken}` },
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return (await res.json()) as boolean;
}

export async function saveImage(input: { imageId: number; accessToken: string }) {
  const res = await fetch(`${API_URL}/saved`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${input.accessToken}`,
    },
    body: JSON.stringify({ imageId: input.imageId }),
  });
  const data = await res.json();
  if (!res.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;
    throw new Error(message || `Request failed (${res.status})`);
  }
  return data;
}
