export function validateUsername(username: string): string | null {
  if (!username) return "username.error.empty";
  if (username.length < 3) return "username.error.too_short";
  if (username.length > 16) return "username.error.too_long";
  if (/\s/.test(username)) return "username.error.spaces";
  if (/^\d/.test(username)) return "username.error.starts_with_number";
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return "username.error.invalid_chars";
  return null;
}
