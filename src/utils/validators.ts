/**
 * Validation Utilities
 * Helper functions for data validation
 */

import { VALIDATION } from '../constants';

/**
 * Validate email address
 */
export const isValidEmail = (email: string): boolean => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

/**
 * Validate phone number
 */
export const isValidPhone = (phone: string): boolean => {
  return VALIDATION.PHONE_REGEX.test(phone);
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    errors.push(`كلمة المرور يجب أن تكون ${VALIDATION.MIN_PASSWORD_LENGTH} أحرف على الأقل`);
  }

  if (password.length > VALIDATION.MAX_PASSWORD_LENGTH) {
    errors.push(`كلمة المرور يجب ألا تتجاوز ${VALIDATION.MAX_PASSWORD_LENGTH} حرف`);
  }

  if (!/[a-z]/.test(password)) {
    errors.push('يجب أن تحتوي على حرف صغير واحد على الأقل');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('يجب أن تحتوي على حرف كبير واحد على الأقل');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('يجب أن تحتوي على رقم واحد على الأقل');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get password strength level
 */
export const getPasswordStrength = (password: string): {
  level: 'weak' | 'medium' | 'strong' | 'very-strong';
  score: number;
} => {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  let level: 'weak' | 'medium' | 'strong' | 'very-strong';
  if (score <= 2) level = 'weak';
  else if (score <= 3) level = 'medium';
  else if (score <= 4) level = 'strong';
  else level = 'very-strong';

  return { level, score };
};

/**
 * Validate username
 */
export const isValidUsername = (username: string): boolean => {
  return (
    username.length >= VALIDATION.MIN_USERNAME_LENGTH &&
    username.length <= VALIDATION.MAX_USERNAME_LENGTH &&
    /^[a-zA-Z0-9_]+$/.test(username)
  );
};

/**
 * Validate price
 */
export const isValidPrice = (price: number): boolean => {
  return price > 0 && Number.isFinite(price);
};

/**
 * Validate URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate date range
 */
export const isValidDateRange = (startDate: Date, endDate: Date): boolean => {
  return startDate <= endDate;
};

/**
 * Validate image file
 */
export const isValidImageFile = (file: File): {
  isValid: boolean;
  error?: string;
} => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'نوع الملف غير مدعوم. يرجى اختيار صورة بصيغة JPG، PNG، WebP، أو GIF',
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت',
    };
  }

  return { isValid: true };
};

/**
 * Sanitize HTML
 */
export const sanitizeHtml = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Check if empty object
 */
export const isEmptyObject = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0;
};

/**
 * Check if valid JSON
 */
export const isValidJson = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};
