<template>
  <el-form class="login">
    <el-form-item prop="username">
      <el-input
        type="text"
        v-model="username"
        autocomplete="off"
        prefix-icon="el-icon-user"
        placeholder="Username" />
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        type="password"
        v-model="password"
        autocomplete="off"
        prefix-icon="el-icon-lock"
        placeholder="Password"
        @keydown="handleKeydown($event.key)" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleLogin">Login</el-button>
      <router-link :to="`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`" class="register">Register</router-link>
    </el-form-item>
    <el-alert type="warning" v-if="accounts.username">
      Please logout first, {{ accounts.username }}.
    </el-alert>
  </el-form>
</template>

<script lang="ts">
import { loginAttempt } from '../api/accounts';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { mapState, Store, useStore } from 'vuex';
import { State } from '@/store';
import * as MutationTypes from '@/store/mutation-types';
import { handleNetworkRequestError } from '@/utils';

export default defineComponent({
  setup() {
    const username = ref('');
    const password = ref('');

    const router = useRouter();
    const redirect = (router.currentRoute.value.query.redirect ?? '/') as string;

    const store = useStore() as Store<State>;

    const handleLogin = async () => {
      const result = await loginAttempt(username.value, password.value);
      if (result.status === 200) {
        store.commit(MutationTypes.LOGIN, result);
        router.push(redirect);
      } else {
        handleNetworkRequestError(store.state.i18n.lang, result);
      }
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
    };
  },
  computed: {
    ...mapState(['accounts']),
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
