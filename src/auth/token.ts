const ACCESS_TOKEN_STORAGE_KEY = "gamex.auth.access-token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function setAccessToken(token: string): void {
  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
}

export function clearAccessToken(): void {
  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function getAuthHeaders(
  token = getAccessToken(),
): Record<string, string> | undefined {
  if (!token) {
    return undefined;
  }

  return { Authorization: `Bearer ${token}` };
}
