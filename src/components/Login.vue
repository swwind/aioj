<template>
  <ui-header />
  <ui-card notitle>
    <ui-input
      type="text"
      icon="user"
      v-model="username"
      placeholder="username"
      class="item"
    />
    <ui-input
      type="password"
      icon="lock"
      v-model="password"
      placeholder="password"
      @keydown="handleKeydown"
      class="item"
    />
    <div class="actions item">
      <ui-button type="primary" @click="handleLogin" icon="location-arrow">
        <ui-text text="login"/>
      </ui-button>
      <router-link :to="`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`" class="register">
        <ui-text text="register"/>
      </router-link>
    </div>
  </ui-card>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { translate } from '@/i18n/translate';
import { MyStore } from '@/store';
import { MutationTypes } from '@/store/mutation-types';
import { ActionTypes } from '@/store/action-types';

export default defineComponent({
  setup() {
    const username = ref('');
    const password = ref('');

    const router = useRouter();
    const redirect = (router.currentRoute.value.query.redirect ?? '/') as string;

    const store = useStore() as MyStore;
    store.commit(MutationTypes.CHANGE_SSR_TITLE, translate(store.state.i18n.lang, 'login'));

    const handleLogin = async () => {
      await store.dispatch(ActionTypes.LOGIN, {
        username,
        password,
        redirect,
      });
    };
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleLogin();
      }
    };

    return {
      username,
      password,
      handleLogin,
      handleKeydown,
      redirect,

      ...toRefs(store.state),
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.login {
  width: 300px;
  margin: 20px 0;
}
.register {
  margin-left: 20px;
}

.item {
  width: 300px;
  margin-top: 20px;
}
</style>
