/**
 * Type Utilities
 * Helper types for better TypeScript usage
 */

/**
 * Make all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Make specific properties required
 */
export type RequireProperties<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific properties optional
 */
export type OptionalProperties<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Extract keys of specific type
 */
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  success: boolean;
}

/**
 * API Error
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Sort configuration
 */
export interface SortConfig<T> {
  field: keyof T;
  direction: 'asc' | 'desc';
}

/**
 * Filter configuration
 */
export type FilterConfig<T> = {
  [K in keyof T]?: T[K] | T[K][] | { min?: T[K]; max?: T[K] };
};

/**
 * Async state
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Form field state
 */
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

/**
 * Form state
 */
export type FormState<T> = {
  [K in keyof T]: FormField<T[K]>;
};

/**
 * Action with payload
 */
export interface Action<T = any> {
  type: string;
  payload?: T;
}

/**
 * ID types
 */
export type ID = string | number;

/**
 * Timestamp
 */
export type Timestamp = string | Date;

/**
 * Nullable
 */
export type Nullable<T> = T | null;

/**
 * Optional
 */
export type Optional<T> = T | undefined;

/**
 * ValueOf - Get value types from object
 */
export type ValueOf<T> = T[keyof T];

/**
 * Entries - Object.entries type
 */
export type Entries<T> = [keyof T, T[keyof T]][];

/**
 * UnwrapArray - Extract array element type
 */
export type UnwrapArray<T> = T extends Array<infer U> ? U : T;

/**
 * UnwrapPromise - Extract promise type
 */
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

/**
 * Mutable - Remove readonly
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * NonEmptyArray - Array with at least one element
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Exact - Ensure exact type match (no extra properties)
 */
export type Exact<T, Shape> = T extends Shape
  ? Exclude<keyof T, keyof Shape> extends never
    ? T
    : never
  : never;

/**
 * PickByValue - Pick properties by value type
 */
export type PickByValue<T, V> = Pick<T, KeysOfType<T, V>>;

/**
 * OmitByValue - Omit properties by value type
 */
export type OmitByValue<T, V> = Omit<T, KeysOfType<T, V>>;

/**
 * Awaitable - Type that can be used with await
 */
export type Awaitable<T> = T | Promise<T>;

/**
 * Constructor type
 */
export type Constructor<T = any> = new (...args: any[]) => T;

/**
 * Function type
 */
export type Func<Args extends any[] = any[], Return = any> = (...args: Args) => Return;

/**
 * Event handler type
 */
export type EventHandler<E = Event> = (event: E) => void;

/**
 * Callback type
 */
export type Callback<T = void> = () => T;

/**
 * Predicate type
 */
export type Predicate<T> = (value: T) => boolean;

/**
 * Comparator type
 */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * Mapper type
 */
export type Mapper<T, U> = (value: T) => U;

/**
 * Reducer type
 */
export type Reducer<T, U> = (accumulator: U, current: T) => U;
