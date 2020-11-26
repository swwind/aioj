<template>
  <el-header class="header">
    <el-menu @select="handleMenuSelect" mode="horizontal" :default-active="activeMenu" class="nav">
      <el-menu-item v-for="menuItem of menus"
        :key="menuItem.url"
        :index="menuItem.url"
        v-text="menuItem.name" />
    </el-menu>
  </el-header>
  <el-main class="main">
    <router-view/>
  </el-main>
  <el-footer class="footer">
    <p>Copyright (c) 2020<br/>Made with ❤ by swwind</p>
  </el-footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup () {
    const router = useRouter();
    const menus = [{
      name: 'Home',
      url: '/',
    }, {
      name: 'About',
      url: '/about',
    }, {
      name: 'Login',
      url: '/login',
    }];
    const activeMenu = router.currentRoute.value.fullPath;
    const handleMenuSelect = (select: string) => {
      router.push(select);
    };

    return {
      handleMenuSelect,
      menus,
      activeMenu,
    };
  },
});
</script>

<style lang="less">
body, html {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, 'WenQuanYi Micro Hei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

@media only screen and (min-width: 1080px) {
  .nav, .main {
    width: 1000px;
    margin: 0 auto;
  }
  body {
    overflow-y: scroll;
  }
}

.footer {
  text-align: center;
}
</style>
