<template>
  <el-header class="header">
    <div class="maxw">
      <el-menu @select="handleMenuSelect" mode="horizontal" :default-active="activeMenu" class="nav">
        <el-menu-item v-for="menuItem of menus"
          :key="menuItem.url"
          :index="menuItem.url"
          v-text="menuItem.name" />
      </el-menu>
      <div class="buttonset" v-if="!accounts.username">
        <el-button @click="jumpTo('/login')">Login</el-button>
        <el-button @click="jumpTo('/register')" type="primary">Register</el-button>
      </div>
      <div class="userpanel" v-else>
        {{ accounts.username }}
      </div>
    </div>
  </el-header>
  <el-main class="main">
    <router-view/>
  </el-main>
  <el-footer class="footer">
    <p>Copyright (c) 2020<br/>Made with ❤</p>
  </el-footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { whoami } from './api/accounts';
import * as MutationTypes from '@/store/mutation-types';
import { mapState } from 'vuex';

export default defineComponent({
  setup() {
    const router = useRouter();

    const menus = [{
      name: 'Home',
      url: '/',
    }, {
      name: 'About',
      url: '/about',
    }, {
      name: 'Forum',
      url: '/r',
    }];
    const activeMenu = router.currentRoute.value.path;
    const handleMenuSelect = (select: string) => {
      router.push(select);
    };

    const jumpTo = (url: string) => {
      router.push(url + '?redirect=' + encodeURIComponent(router.currentRoute.value.path));
    };

    return {
      handleMenuSelect,
      menus,
      activeMenu,
      jumpTo,
    };
  },

  computed: {
    ...mapState(['accounts']),
  },

  async mounted() {
    const result = await whoami();
    if (result.status === 200) {
      this.$store.commit(MutationTypes.LOGIN, result.username);
    }
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

a {
  text-decoration: none;
  color: #2c3e50;

  &:hover {
    text-decoration: underline;
  }
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
  .maxw, .main {
    width: 1000px;
    margin: 0 auto;
  }
  body {
    overflow-y: scroll;
  }
}

.maxw {
  display: flex;

  .nav {
    flex: 1;
  }
}

.buttonset, .userpanel {
  border-bottom: solid 1px #e6e6e6;
}

.buttonset {
  padding-top: 11px;
}

.userpanel {
  line-height: 60px;
  padding: 0 20px;
}

.footer {
  text-align: center;
  font-size: .8rem;
}
</style>
