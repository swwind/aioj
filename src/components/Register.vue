<template>
  <el-form label-width="200px" class="register">
    <el-form-item label="Username" prop="username">
      <el-input type="text" v-model="username" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="Password" prop="password">
      <el-input type="password" v-model="password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="Repeate Password" prop="reappass">
      <el-input type="password" v-model="reappass" autocomplete="off" @keydown="handleKeydown($event.key)"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleRegister">Register</el-button>
      <router-link to="/login" class="login">Login</router-link>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { registerAttempt } from '../api/accounts';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup () {
    const username = ref('');
    const password = ref('');
    const reappass = ref('');

    const router = useRouter();
    const redirect = (router.currentRoute.value.query.redirect ?? '/') as string;

    const handleRegister = async () => {
      if (password.value !== reappass.value) {
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
      reappass,
      handleRegister,
      handleKeydown,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.register {
  width: 500px;
  margin: 200px auto;
}
.login {
  margin-left: 20px;
}
</style>
