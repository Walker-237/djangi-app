export function hasStoredToken(): boolean {
  if (typeof localStorage === 'undefined') return false;

  const rawToken = localStorage.getItem('token');
  if (!rawToken) return false;

  const normalizedToken = rawToken.trim();
  if (
    !normalizedToken ||
    normalizedToken === 'null' ||
    normalizedToken === 'undefined'
  ) {
    return false;
  }

  try {
    const parsedToken = JSON.parse(normalizedToken);
    if (parsedToken && typeof parsedToken === 'object') {
      return Object.keys(parsedToken).length > 0;
    }
  } catch {
    return true;
  }

  return true;
}
