const ALLOWED_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "aol.com",
  "msn.com",
  "live.com",
  "me.com",
  "zoho.com",
  "protonmail.com",
  "gmx.com",
  "mail.com",
  "fastmail.com",
  "tutanota.com",
  "yandex.ru",
  "qq.com",
  "gmx.de",
  "web.de",
  "ymail.com",
  "handsforhire.com",
]);

export function isAllowedEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  const match = normalized.match(/^([^\s@]+)@([^\s@]+\.[^\s@]+)$/);
  if (!match) return false;

  return ALLOWED_EMAIL_DOMAINS.has(match[2]);
}
