<template>
  <el-form class="login">
    <el-form-item prop="username">
      <el-input
        type="text"
        v-model="username"
        autocomplete="off"
        prefix-icon="el-icon-user"
        :placeholder="translate(i18n.lang, 'username')" />
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        type="password"
        v-model="password"
        autocomplete="off"
        prefix-icon="el-icon-lock"
        :placeholder="translate(i18n.lang, 'password')"
        @keydown="handleKeydown($event.key)" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleLogin">{{ translate(i18n.lang, 'login') }}</el-button>
      <router-link :to="`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`" class="register">{{ translate(i18n.lang, 'register') }}</router-link>
    </el-form-item>
    <el-alert type="warning" v-if="accounts.username">
      Please logout first, {{ accounts.username }}.
    </el-alert>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ActionTypes, MutationTypes, StoreState } from '@/store';
import { handleNetworkRequestError } from '@/utils';
import { translate } from '@/i18n/translate';
import { API } from '@/api';

export default defineComponent({
  setup() {
    const username = ref('');
    const password = ref('');

    const router = useRouter();
    const redirect = (router.currentRoute.value.query.redirect ?? '/') as string;

    const store = useStore<StoreState>();
    store.commit(MutationTypes.CHANGE_SSR_TITLE, `${translate(store.state.i18n.lang, 'login')} - AIOJ`);

    const handleLogin = async () => {
      await store.dispatch(ActionTypes.LOGIN, {
        username,
        password,
        redirect,
      });
    };
    const handleKeydown = (key: string) => {
      if (key === 'Enter') {
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
  margin: 150px auto 0;
}
.register {
  margin-left: 20px;
}
</style>
