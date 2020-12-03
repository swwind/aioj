<template>
  <el-header class="header">
    <div class="maxw">
      <el-menu @select="handleMenuSelect" mode="horizontal" :default-active="activeMenu" class="nav">
        <el-menu-item v-for="menuItem of menus"
          :key="menuItem.url"
          :index="menuItem.url">
          {{ translate(i18n.lang, menuItem.name) }}
        </el-menu-item>
      </el-menu>
      <div class="buttonset" v-if="!accounts.username">
        <el-button @click="jumpTo('/login')">{{ translate(i18n.lang, 'login') }}</el-button>
        <el-button @click="jumpTo('/register')" type="primary">{{ translate(i18n.lang, 'register') }}</el-button>
      </div>
      <div class="userpanel" v-else>
        <router-link :to="`/u/${accounts.username}`" :class="{ admin: accounts.admin }">
          {{ accounts.username }}
        </router-link>
      </div>
    </div>
  </el-header>
  <el-main class="main">
    <router-view v-slot="{ Component }">
      <suspense>
        <template #default>
          <component :is="Component"/>
        </template>
        <template #fallback>
          <div>Loading...</div>
        </template>
      </suspense>
    </router-view>
  </el-main>
  <el-footer class="footer">
    <p>
      Copyright (c) 2020<br/>
      Made with ❤
      <span
        v-for="lang of langs"
        @click="useLang(lang.name)"
        :key="lang.name"
        class="clickable"
        :class="{ disabled: lang.name === i18n.lang }">
        {{ lang.show }}
      </span>
    </p>
  </el-footer>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';
import { whoami } from './api/accounts';
import { useStore } from 'vuex';
import { getRedirect } from './utils';
import { translate } from '@/i18n/translate';
import { StoreState, MutationTypes } from './store';
import { defineComponent, onMounted, toRefs, watch } from 'vue';

export default defineComponent({
  setup() {
    const router = useRouter();
    const store = useStore<StoreState>();

    const menus = [{
      name: 'home',
      url: '/',
    }, {
      name: 'about',
      url: '/about',
    }, {
      name: 'forum',
      url: '/r',
    }];
    const activeMenu = router.currentRoute.value.path;
    const handleMenuSelect = (select: string) => {
      router.push(select);
    };

    const jumpTo = (url: string) => {
      router.push(`${url}${getRedirect(router.currentRoute)}`);
    };

    const langs = [{
      name: 'zh_cn',
      show: '中文',
    }, {
      name: 'en_us',
      show: 'English',
    }];
    const useLang = (lang: string) => {
      store.commit(MutationTypes.UPDATE_LANGUAGE, lang);
    };

    onMounted(async () => {
      const result = await whoami();
      if (result.status === 200) {
        store.commit(MutationTypes.LOGIN, result.user);
      } else {
        // ignore it
      }
    });

    return {
      handleMenuSelect,
      menus,
      activeMenu,
      jumpTo,
      translate,
      langs,
      useLang,

      ...toRefs(store.state),
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

body {
  overflow-y: scroll !important;
}

textarea {
  font-family: sans-serif;
}

a, .clickable {
  text-decoration: none;
  color: #2c3e50;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  &.disabled {
    cursor: default;
    font-weight: bold;
    text-decoration: none;
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
}

.maxw {
  display: flex;

  .nav {
    flex: 1;
  }
}

</style>

<style lang="less" scoped>

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

  .clickable {
    margin: 0 5px;
  }
}

</style>
