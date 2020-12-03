/* eslint-disable */
import { ComponentCustomProperties } from 'vue';
import { Store } from 'vuex';
import { StoreState } from './modules';
import { ElNotification } from 'element-plus';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<StoreState>;
    $notify: typeof ElNotification;
  }
}
