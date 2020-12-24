<template>
  <ui-card notitle>
    <ui-input
      type="text"
      icon="perm_identity"
      v-model="username"
      :placeholder="translate(i18n.lang, 'username')"
      class="item"
    />
    <ui-input
      type="password"
      icon="lock"
      v-model="password"
      :placeholder="translate(i18n.lang, 'password')"
      @keydown="handleKeydown"
      class="item"
    />
    <div class="actions item">
      <ui-button type="primary" @click="handleLogin">{{ translate(i18n.lang, 'login') }}</ui-button>
      <router-link :to="`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`" class="register">{{ translate(i18n.lang, 'register') }}</router-link>
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
      translate,

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
