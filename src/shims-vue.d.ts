declare module 'markdown-it-katex' {
  import type { PluginSimple } from 'markdown-it';
  const katex: PluginSimple;
  export default katex;
}

declare const flvjs: typeof import('flv.js').default;
