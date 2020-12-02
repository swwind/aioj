import { App } from "vue";
import { Router } from "vue-router";
import { Store } from "vuex";

export function createVueApp(ssr: boolean): {
  app: App<Element>,
  router: Router,
  store: Store<any>,
}
