import { App } from "vue";
import { Router } from "vue-router";

export function createVueApp(ssr: boolean): {
  app: App<Element>,
  router: Router,
}
