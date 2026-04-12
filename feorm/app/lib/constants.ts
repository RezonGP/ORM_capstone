const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3069';

export const API_URL = RAW_API_URL.trim()
    .replace(/\/api\/?$/i, '')
    .replace(/\/+$/g, '');
