/**
 * Validate a returnTo value is same-origin.
 * Must start with "/" but not "//" (protocol-relative URLs point to any host).
 * Prevents open redirect attacks on post-login redirects.
 */
export function isSafeReturnTo(value: string): boolean {
  return value.startsWith("/") && !value.startsWith("//");
}

export function appendReturnTo(path: string, returnTo?: string): string {
  if (!returnTo || !isSafeReturnTo(returnTo)) {
    return path;
  }
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}returnTo=${encodeURIComponent(returnTo)}`;
}
