import { browser } from '$app/environment';
import type { PublicUser } from '@restaurant/shared-types';
import { api } from './api';

const ACCESS_TOKEN_KEY = 'restaurant.accessToken';
const REFRESH_TOKEN_KEY = 'restaurant.refreshToken';
const USER_KEY = 'restaurant.user';

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: PublicUser | null;
}

function readStorage(): AuthState {
  if (!browser) {
    return { accessToken: null, refreshToken: null, user: null };
  }

  const userRaw = localStorage.getItem(USER_KEY);
  return {
    accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
    user: userRaw ? (JSON.parse(userRaw) as PublicUser) : null
  };
}

let state = readStorage();

export function getAuthState(): AuthState {
  return state;
}

export function setAuthState(next: AuthState): void {
  state = next;

  if (!browser) {
    return;
  }

  if (next.accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, next.accessToken);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  if (next.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, next.refreshToken);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  if (next.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(next.user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function clearAuthState(): void {
  setAuthState({ accessToken: null, refreshToken: null, user: null });
}

export function requireRole(roles: Array<PublicUser['role']>): boolean {
  const user = state.user;
  return Boolean(user && roles.includes(user.role));
}

export async function logout(): Promise<void> {
  const auth = getAuthState();

  if (auth.refreshToken) {
    try {
      await api.logout(auth.refreshToken);
    } catch {
      // ignore and still clear local state
    }
  }

  clearAuthState();
}
