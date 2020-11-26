<template>
  <el-form label-width="200px" class="login">
    <el-form-item label="Username" prop="username">
      <el-input type="text" v-model="username" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="Password" prop="password">
      <el-input type="password" v-model="password" autocomplete="off" @keydown="handleKeydown($event.key)"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleLogin">Login</el-button>
      <router-link to="/register" class="register">Register</router-link>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { loginAttempt } from '../api/accounts';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup () {
    const username = ref('');
    const password = ref('');

    const router = useRouter();
    const redirect = (router.currentRoute.value.query.redirect ?? '/') as string;

    const handleLogin = async () => {
      const result = await loginAttempt(username.value, password.value);
      if (result.status === 200) {
        router.push(redirect);
      } else {
        alert('failed login: ' + result.error);
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
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.login {
  width: 500px;
  margin: 200px auto;
}
.register {
  margin-left: 20px;
}
</style>
