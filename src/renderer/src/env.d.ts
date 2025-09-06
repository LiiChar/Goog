/// <reference types="vite/client" />
RENDERER_VITE_GOOGLE_API = string;
declare global {
  interface Window {
    api: {
      onCommandStatus: (callback: (data: any) => void) => void;
    };
    darkMode: {
      toggle: () => {};
    };
  }
}
