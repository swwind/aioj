<template>
  <ui-card notitle>
    <ui-input
      type="text"
      v-model="username"
      icon="perm_identity"
      :placeholder="translate(i18n.lang, 'username')"
      class="item"
    />
    <ui-input
      type="password"
      v-model="password"
      icon="lock"
      :placeholder="translate(i18n.lang, 'password')"
      class="item"
    />
    <ui-input
      type="password"
      v-model="reptpass"
      icon="lock"
      :placeholder="translate(i18n.lang, 'repeat_password')"
      @keydown="handleKeydown"
      class="item"
    />
    <div class="actions item">
      <el-button type="primary" @click="handleRegister">{{ translate(i18n.lang, 'register') }}</el-button>
      <router-link :to="`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`" class="login">{{ translate(i18n.lang, 'login') }}</router-link>
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
    const reptpass = ref('');

    const router = useRouter();
    const store = useStore() as MyStore;
    const redirect = (router.currentRoute.value.query.redirect ?? '/') as string;
    store.commit(MutationTypes.CHANGE_SSR_TITLE, translate(store.state.i18n.lang, 'register'));

    const handleRegister = async () => {
      if (password.value !== reptpass.value) {
        alert('password mismatch!');
        return;
      }
      await store.dispatch(ActionTypes.REGISTER, {
        username,
        password,
        redirect,
      });
    };
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleRegister();
      }
    };

    return {
      username,
      password,
      reptpass,
      handleRegister,
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
.register {
  width: 300px;
  margin: 20px 0;
}
.login {
  margin-left: 20px;
}

.item {
  width: 300px;
  margin-top: 20px;
}
</style>
