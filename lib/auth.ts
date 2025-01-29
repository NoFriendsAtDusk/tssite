// Simple client-side auth for static sites
const AUTH_COOKIE = 'session'

export function setAuthCookie(username: string) {
  // Set cookie with 24 hour expiry
  document.cookie = `${AUTH_COOKIE}=${btoa(username)};path=/;max-age=86400;secure;samesite=strict`
}

export function getAuthCookie(): string | null {
  const cookies = document.cookie.split(';')
  const authCookie = cookies.find(cookie => cookie.trim().startsWith(`${AUTH_COOKIE}=`))
  return authCookie ? authCookie.split('=')[1] : null
}

export function removeAuthCookie() {
  document.cookie = `${AUTH_COOKIE}=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`
}

export function validateCredentials(username: string, password: string): boolean {
  return username === 'admin' && password === 'admin123'
}
