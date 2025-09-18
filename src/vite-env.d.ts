/// <reference types="vite/client" />

declare global {
  interface Window {
    pannellum: {
      viewer: (container: string, config: any) => any;
    }
  }
}
