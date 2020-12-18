import { App } from "vue";
import { Router } from "vue-router";
import { Store } from "vuex";

export function createVueApp(ssr: boolean, cookie?: string): {
  app: App<Element>,
  router: Router,
  store: Store<any>,
}
