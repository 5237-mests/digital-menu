import type { CartItem } from '@restaurant/shared-types';

const carts = new Map<string, CartItem[]>();

export function getCart(qrCode: string): CartItem[] {
  return carts.get(qrCode) ?? [];
}

export function setCart(qrCode: string, items: CartItem[]): void {
  carts.set(qrCode, items);
}

export function addToCart(qrCode: string, item: Omit<CartItem, 'quantity'> & { quantity?: number }): CartItem[] {
  const current = getCart(qrCode);
  const existing = current.find((entry) => entry.menuItemId === item.menuItemId);

  if (existing) {
    existing.quantity += item.quantity ?? 1;
    setCart(qrCode, [...current]);
    return getCart(qrCode);
  }

  const next = [...current, { ...item, quantity: item.quantity ?? 1, notes: item.notes ?? '' }];
  setCart(qrCode, next);
  return next;
}

export function updateCartItem(qrCode: string, menuItemId: number, quantity: number): CartItem[] {
  const next = getCart(qrCode)
    .map((item) => (item.menuItemId === menuItemId ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);
  setCart(qrCode, next);
  return next;
}

export function clearCart(qrCode: string): void {
  carts.delete(qrCode);
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
}
