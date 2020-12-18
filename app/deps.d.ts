import { Middleware } from "koa";

declare module 'koa-subdomain' {
  class Subdomain {
    use(subdomain: string, mw: Middleware): void;
    routes(): Middleware;
  }
  export = Subdomain;
}
