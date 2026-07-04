import type {
  AuthResponse,
  Category,
  DashboardSales,
  DashboardStats,
  MenuItem,
  OrderDetail,
  OrderStatus,
  PublicMenuResponse,
  PublicUser,
  Settings,
  Table
} from '@restaurant/shared-types';

// const API_BASE = " http://localhost:3001";
const API_BASE = "https://www.menu.hypertechtechnology.com";

interface RequestOptions extends RequestInit {
  token?: string | null;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers ?? {});
  headers.set('Content-Type', 'application/json');

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  login(email: string, password: string) {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  me(token: string) {
    return request<PublicUser>('/auth/me', { token });
  },

  getPublicMenu(qrCode: string) {
    return request<PublicMenuResponse>(`/public/menu/${encodeURIComponent(qrCode)}`);
  },

  createOrder(payload: { tableId: number; items: Array<{ menuItemId: number; quantity: number; notes?: string }> }) {
    return request<OrderDetail>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  getOrder(orderId: number) {
    return request<OrderDetail>(`/orders/${orderId}`);
  },

  getOrders(token: string, status?: OrderStatus) {
    const query = status ? `?status=${status}` : '';
    return request<OrderDetail['order'][]>(`/orders${query}`, { token });
  },

  updateOrderStatus(token: string, orderId: number, status: OrderStatus) {
    return request<OrderDetail>(`/orders/${orderId}/status`, {
      method: 'PATCH',
      token,
      body: JSON.stringify({ status })
    });
  },

  getCategories(token: string) {
    return request<Category[]>('/categories', { token });
  },

  createCategory(token: string, payload: Partial<Category> & { name: string }) {
    return request<Category>('/categories', {
      method: 'POST',
      token,
      body: JSON.stringify(payload)
    });
  },

  updateCategory(token: string, id: number, payload: Partial<Category>) {
    return request<Category>(`/categories/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(payload)
    });
  },

  deleteCategory(token: string, id: number) {
    return request<{ success: true }>(`/categories/${id}`, {
      method: 'DELETE',
      token
    });
  },

  getMenuItems(token: string) {
    return request<MenuItem[]>('/menu-items', { token });
  },

  createMenuItem(token: string, payload: Record<string, unknown>) {
    return request<MenuItem>('/menu-items', {
      method: 'POST',
      token,
      body: JSON.stringify(payload)
    });
  },

  updateMenuItem(token: string, id: number, payload: Record<string, unknown>) {
    return request<MenuItem>(`/menu-items/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(payload)
    });
  },

  deleteMenuItem(token: string, id: number) {
    return request<{ success: true }>(`/menu-items/${id}`, {
      method: 'DELETE',
      token
    });
  },

  getTables(token: string) {
    return request<Table[]>('/tables', { token });
  },

  createTable(token: string, payload: Record<string, unknown>) {
    return request<Table>('/tables', {
      method: 'POST',
      token,
      body: JSON.stringify(payload)
    });
  },

  updateTable(token: string, id: number, payload: Record<string, unknown>) {
    return request<Table>(`/tables/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(payload)
    });
  },

  deleteTable(token: string, id: number) {
    return request<{ success: true }>(`/tables/${id}`, {
      method: 'DELETE',
      token
    });
  },

  getUsers(token: string) {
    return request<PublicUser[]>('/users', { token });
  },

  createUser(token: string, payload: Record<string, unknown>) {
    return request<PublicUser>('/users', {
      method: 'POST',
      token,
      body: JSON.stringify(payload)
    });
  },

  updateUser(token: string, id: number, payload: Record<string, unknown>) {
    return request<PublicUser>(`/users/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(payload)
    });
  },

  deleteUser(token: string, id: number) {
    return request<{ success: true }>(`/users/${id}`, {
      method: 'DELETE',
      token
    });
  },

  getDashboardStats(token: string) {
    return request<DashboardStats>('/dashboard/stats', { token });
  },

  getDashboardSales(token: string) {
    return request<DashboardSales[]>('/dashboard/sales', { token });
  },

  getSettings() {
    return request<Settings>('/settings');
  },

  updateSettings(token: string, payload: Settings) {
    return request<Settings>('/settings', {
      method: 'PUT',
      token,
      body: JSON.stringify(payload)
    });
  }
};
