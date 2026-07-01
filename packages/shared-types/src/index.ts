export type UserRole = 'ADMIN' | 'CHEF';

export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';

export interface ApiHealth {
  readonly status: 'ok';
  readonly service: string;
}

export interface PublicUser {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
}

export interface AuthResponse {
  readonly user: PublicUser;
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface Category {
  readonly id: number;
  readonly name: string;
  readonly image: string | null;
  readonly isActive: boolean;
  readonly sortOrder: number;
}

export interface MenuItem {
  readonly id: number;
  readonly categoryId: number;
  readonly name: string;
  readonly description: string | null;
  readonly image: string | null;
  readonly price: string;
  readonly preparationTime: number;
  readonly isAvailable: boolean;
}

export interface Table {
  readonly id: number;
  readonly tableNumber: number;
  readonly qrCode: string;
  readonly status: 'AVAILABLE' | 'OCCUPIED' | 'DISABLED';
}

export interface Order {
  readonly id: number;
  readonly orderNumber: string;
  readonly tableId: number;
  readonly status: OrderStatus;
  readonly total: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface OrderItem {
  readonly id: number;
  readonly orderId: number;
  readonly menuItemId: number;
  readonly item_name: string;
  readonly quantity: number;
  readonly price: string;
  readonly notes: string | null;
}

export interface OrderDetail {
  readonly order: Order;
  readonly items: OrderItem[];
  readonly estimatedPrepTime: number;
}

export interface DashboardStats {
  readonly totalOrders: number;
  readonly pendingOrders: number;
  readonly preparingOrders: number;
  readonly readyOrders: number;
  readonly deliveredOrders: number;
  readonly cancelledOrders: number;
  readonly totalSales: string;
}

export interface DashboardSales {
  readonly date: string;
  readonly totalSales: string;
  readonly orders: number;
}

export interface Settings {
  readonly restaurantName: string;
  readonly currency: string;
  readonly taxRate: string;
}

export interface PublicMenuResponse {
  readonly table: Table;
  readonly categories: Category[];
  readonly menuItems: MenuItem[];
}

export interface CartItem {
  readonly menuItemId: number;
  readonly name: string;
  readonly price: string;
  readonly quantity: number;
  readonly notes: string;
}
