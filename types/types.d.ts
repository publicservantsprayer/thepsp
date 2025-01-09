declare module 'server-only'

type APIResponse<T = object> =
  | { success: true; data: T }
  | { success: false; error: string }
