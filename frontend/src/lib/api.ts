export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `/api${endpoint}`;

  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Ensures HTTP-only session cookies are sent
  });

  const data = await response.json().catch(() => ({
    success: false,
    error: { code: 'INVALID_RESPONSE', message: 'Respons server tidak valid.' },
  }));

  if (!response.ok || !data.success) {
    const errorMsg = data.error?.message || data.message || `HTTP Error ${response.status}`;
    const err = new Error(errorMsg);
    (err as any).code = data.error?.code || 'UNKNOWN_ERROR';
    (err as any).details = data.error?.details;
    (err as any).status = response.status;
    throw err;
  }

  return data.data;
}

export const api = {
  get: <T = any>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  post: <T = any>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: <T = any>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: <T = any>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: <T = any>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),
  upload: <T = any>(endpoint: string, formData: FormData) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: formData,
    }),
};
