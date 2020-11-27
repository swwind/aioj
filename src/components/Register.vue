<template>
  <el-form class="register">
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
        placeholder="Password" />
    </el-form-item>
    <el-form-item prop="reptpass">
      <el-input
        type="password"
        v-model="reptpass"
        autocomplete="off"
        prefix-icon="el-icon-lock"
        placeholder="Repeat Password"
        @keydown="handleKeydown($event.key)" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleRegister">Register</el-button>
      <router-link to="/login" class="login">Login</router-link>
    </el-form-item>
    <el-alert type="warning" v-if="accounts.username">
      Please logout first, {{ accounts.username }}.
    </el-alert>
    <el-alert type="error" v-if="errorMessage" v-text="errorMessage" />
  </el-form>
</template>

<script lang="ts">
import { registerAttempt } from '../api/accounts';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { mapState } from 'vuex';

export default defineComponent({
  setup() {
    const username = ref('');
    const password = ref('');
    const reptpass = ref('');

    const router = useRouter();
    const redirect = (router.currentRoute.value.query.redirect ?? '/') as string;

    const errorMessage = ref('');

    const handleRegister = async () => {
      if (password.value !== reptpass.value) {
        alert('password mismatch!');
        return;
      }
      const result = await registerAttempt(username.value, password.value);
      if (result.status === 200) {
        router.push(redirect);
      } else {
        alert('failed login: ' + result.error);
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
      errorMessage,
    };
  },
  computed: {
    ...mapState(['accounts']),
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
