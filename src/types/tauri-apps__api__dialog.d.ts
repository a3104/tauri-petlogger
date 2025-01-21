declare module '@tauri-apps/api/dialog' {
  export function message(content: string, type: 'info' | 'warning' | 'error'): Promise<void>;
}
