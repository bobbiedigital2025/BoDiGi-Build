import { timingSafeEqual } from 'crypto';

function asString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function timingSafeTokenMatch(leftValue, rightValue) {
  const leftBuffer = Buffer.from(asString(leftValue), 'utf8');
  const rightBuffer = Buffer.from(asString(rightValue), 'utf8');
  const maxLength = Math.max(leftBuffer.length, rightBuffer.length, 1);
  const paddedLeft = Buffer.alloc(maxLength);
  const paddedRight = Buffer.alloc(maxLength);
  leftBuffer.copy(paddedLeft);
  rightBuffer.copy(paddedRight);
  return timingSafeEqual(paddedLeft, paddedRight) && leftBuffer.length === rightBuffer.length;
}
