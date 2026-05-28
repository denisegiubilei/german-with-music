/**
 * Validate a returnTo value is same-origin.
 * Must start with "/" but not "//" (protocol-relative URLs point to any host).
 * Prevents open redirect attacks on post-login redirects.
 */
export function isSafeReturnTo(value: string): boolean {
  return value.startsWith("/") && !value.startsWith("//");
}
