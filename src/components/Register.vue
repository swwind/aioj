<template>
  <el-form class="register">
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
        :placeholder="translate(i18n.lang, 'password')" />
    </el-form-item>
    <el-form-item prop="reptpass">
      <el-input
        type="password"
        v-model="reptpass"
        autocomplete="off"
        prefix-icon="el-icon-lock"
        :placeholder="translate(i18n.lang, 'repeat_password')"
        @keydown="handleKeydown($event.key)" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleRegister">{{ translate(i18n.lang, 'register') }}</el-button>
      <router-link :to="`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`" class="login">{{ translate(i18n.lang, 'login') }}</router-link>
    </el-form-item>
    <el-alert type="warning" v-if="accounts.username">
      Please logout first, {{ accounts.username }}.
    </el-alert>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import * as MutationTypes from '../store/mutation-types';
import { useStore } from 'vuex';
import { StoreState } from '@/store';
import { handleNetworkRequestError } from '@/utils';
import { translate } from '@/i18n/translate';
import { API } from '@/api';

export default defineComponent({
  setup() {
    const username = ref('');
    const password = ref('');
    const reptpass = ref('');

    const router = useRouter();
    const store = useStore<StoreState>();
    const redirect = (router.currentRoute.value.query.redirect ?? '/') as string;
    store.commit(MutationTypes.CHANGE_SSR_TITLE, `${translate(store.state.i18n.lang, 'register')} - AIOJ`);

    const handleRegister = async () => {
      if (password.value !== reptpass.value) {
        alert('password mismatch!');
        return;
      }
      const result = await API.registerAttempt(username.value, password.value);
      if (result.status === 200) {
        store.commit(MutationTypes.LOGIN, result);
        router.push(redirect);
      } else {
        handleNetworkRequestError(store, result);
      }
    };
    const handleKeydown = (key: string) => {
      if (key === 'Enter') {
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
  margin: 150px auto 0;
}
.login {
  margin-left: 20px;
}
</style>
