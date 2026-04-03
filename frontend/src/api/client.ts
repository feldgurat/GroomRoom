import type { User, Order, Token, RegisterPayload } from '../types';

const API = '/api';

export class ApiError extends Error {
  status: number;
  detail: string | ApiDetailArray;
  constructor(status: number, detail: string | ApiDetailArray) {
    super(typeof detail === 'string' ? detail : 'Validation error');
    this.status = status;
    this.detail = detail;
  }
}

type ApiDetailArray = { loc: (string | number)[]; msg: string }[];

function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function removeToken() {
  localStorage.removeItem('token');
}

async function request<T>(
  method: string,
  url: string,
  opts: { body?: unknown; isForm?: boolean; auth?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (opts.auth) {
    const t = getToken();
    if (t) headers['Authorization'] = `Bearer ${t}`;
  }
  if (!opts.isForm && opts.body) {
    headers['Content-Type'] = 'application/json';
  }

  const init: RequestInit = { method, headers };
  if (opts.body) {
    init.body = opts.isForm ? (opts.body as FormData) : JSON.stringify(opts.body);
  }

  const resp = await fetch(`${API}${url}`, init);

  if (!resp.ok) {
    let detail: string | ApiDetailArray = 'Произошла ошибка';
    try {
      const d = await resp.json();
      detail = d.detail ?? detail;
    } catch { /* empty */ }
    throw new ApiError(resp.status, detail);
  }
  if (resp.status === 204) return null as T;
  return resp.json() as Promise<T>;
}

// ── Auth ─────────────────────────────────────────────────────────
export const login = (loginVal: string, password: string) =>
  request<Token>('POST', '/auth/login', { body: { login: loginVal, password } });

export const register = (payload: RegisterPayload) =>
  request<User>('POST', '/auth/register', { body: payload });

export const logout = async () => {
  try { await request('POST', '/auth/logout', { auth: true }); } catch { /* ok */ }
  removeToken();
};

export const getMe = () => request<User>('GET', '/user/me', { auth: true });

// ── Orders ───────────────────────────────────────────────────────
export const getCompletedOrders = () =>
  request<Order[]>('GET', '/orders/public/completed-orders');

export const getMyOrders = () =>
  request<Order[]>('GET', '/orders/my-orders', { auth: true });

export const createOrder = (petName: string, photo: File) => {
  const fd = new FormData();
  fd.append('pet_name', petName);
  fd.append('photo', photo);
  return request<Order>('POST', '/orders/create-order', { body: fd, isForm: true, auth: true });
};

export const deleteOrder = (id: string) =>
  request<{ status: boolean; messange: string }>('DELETE', `/orders/${id}`, { auth: true });

// ── Admin ────────────────────────────────────────────────────────
export const adminGetAllOrders = () =>
  request<Order[]>('GET', '/admin/all-orders', { auth: true });

export const adminStartProcessing = (id: string) =>
  request<Order>('POST', `/admin/orders/${id}/start-processing`, { auth: true });

export const adminComplete = (id: string, photo: File) => {
  const fd = new FormData();
  fd.append('result_photo', photo);
  return request<Order>('POST', `/admin/orders/${id}/complete`, { body: fd, isForm: true, auth: true });
};
