import 'server-only';
import crypto from 'node:crypto';

// With no GROUP_PASSCODE set, anyone with the link can join with just a name.
export function passcodeRequired() {
  return Boolean(process.env.GROUP_PASSCODE?.trim());
}

export function passcodeMatches(input) {
  if (!passcodeRequired()) return true;
  // Compare hashes so the check takes the same time whatever was typed.
  const a = crypto.createHash('sha256').update(String(input ?? '')).digest();
  const b = crypto.createHash('sha256').update(process.env.GROUP_PASSCODE.trim()).digest();
  return crypto.timingSafeEqual(a, b);
}
