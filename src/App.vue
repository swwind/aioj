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
        <template #error>
          <div>Explosion!!!</div>
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
import { useStore } from 'vuex';
import { closeSSRFetchPrevention, getRedirect, handleNetworkRequestError, preventSSRFetchTwice } from './utils';
import { translate } from '@/i18n/translate';
import { StoreState, MutationTypes, ActionTypes } from './store';
import { defineComponent, onMounted, toRefs } from 'vue';
import { API } from './api';
import configs from '../config.json';

export default defineComponent({
  async setup() {
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

    onMounted(() => {
      closeSSRFetchPrevention();

      const fuck = (bg: string) => {
        const bgdiv = document.createElement('div');
        bgdiv.classList.add('background-image');
        bgdiv.style.backgroundImage = `url(${bg})`;
        document.body.appendChild(bgdiv);
        return bgdiv;
      }
      const divs = configs.backgrounds.map(fuck);

      let cnt = 0;
      divs[cnt].classList.add('show');
      setInterval(() => {
        divs[cnt].classList.remove('show');
        cnt = (cnt + 1) % configs.backgrounds.length;
        divs[cnt].classList.add('show');
      }, 5000);
    });

    if (preventSSRFetchTwice()) {
      await store.dispatch(ActionTypes.FETCH_ACCOUNT_DATA);
    }

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

.el-card {
  .el-card__header {
    h1, h2, h3, h4, h5, h6 {
      margin: 0;
    }
  }

  .el-card__body {
    padding: 0 20px;
  }
}

.background-image {
  position: fixed;
  z-index: -1;
  width: 100vw;
  top: 0;
  left: 0;
  height: 100vh;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0;
  transition: opacity .5s;

  &.show {
    opacity: 1;
  }
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

.marked {
  img, audio, video {
    max-width: 100%;
  }
}

.el-menu {
  background-color: transparent;
}

.el-card, .el-header {
  background-color: #ffffffc0 !important;
}

</style>

<style lang="less" scoped>

.header {
  background-color: white;
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

  .clickable {
    margin: 0 5px;
  }
}

</style>
