<template>
  <ui-frame>
    <template #fixed>
      <ui-menu class="nav" :menus="menus"></ui-menu>
      <div class="buttonset" v-if="!accounts.username">
        <ui-button
          @click="jumpTo('/login')">
          {{ translate(i18n.lang, 'login') }}
        </ui-button>
        <ui-button
          @click="jumpTo('/register')"
          type="primary">
          {{ translate(i18n.lang, 'register') }}
        </ui-button>
      </div>
      <div class="userpanel" v-else>
        <router-link class="username" :to="`/u/${accounts.username}`">
          {{ accounts.username }}
        </router-link>
      </div>
    </template>
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
    <template #footer>
      <div class="links">
        <div class="row">
          <div class="title">你们啊</div>
          <div class="item"><span>不要总想着</span></div>
          <div class="item"><span>就把我</span></div>
        </div>
        <div class="row">
          <div class="title">还是太年轻了</div>
          <div class="item"><span>搞个大新闻</span></div>
          <div class="item"><span>批判一番</span></div>
        </div>
      </div>
      <div class="copys">
        <div class="left">
          Copyright (c) 2020 swwind
        </div>
        <div class="right">
          <span
            v-for="lang of langs"
            @click="useLang(lang.name)"
            :key="lang.name"
            class="language"
            :class="{ disabled: lang.name === i18n.lang }">
            {{ lang.show }}
          </span>
        </div>
      </div>
    </template>
  </ui-frame>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { getRedirect } from './utils';
import { translate } from '@/i18n/translate';
import { defineComponent, onMounted, toRefs } from 'vue';
import { MyStore } from './store';
import { MutationTypes } from './store/mutation-types';
import { ActionTypes } from './store/action-types';

export default defineComponent({
  async setup() {
    const router = useRouter();
    const store = useStore() as MyStore;

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
      store.dispatch(ActionTypes.UNBLOCK_SSR);
    });

    await store.dispatch(ActionTypes.FETCH_ACCOUNT_DATA);

    return {
      menus,
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
@import '@/plugins/ui/styles/colors.less';
@import '@/plugins/ui/styles/vars.less';
@import './confirm.less';

body, html {
  padding: 0;
  margin: 0;
}

body {
  height: 100%;
  width: 100%;
  background-color: @background-color;
  color: @font-color;
  overflow-y: scroll;
}

a {
  color: @theme-color;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}
::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}
::-webkit-scrollbar-thumb {
  background: @scrollbar-color;
  border: none;
  transition: all ease 0.1s;
  cursor: pointer;
}

</style>

<style lang="less" scoped>
@import '@/plugins/ui/styles/vars.less';

.nav {
  flex: 1;
}

.buttonset {
  margin: 0 20px;

  &::after {
    content: '';
    width: 0;
    height: 60px;
    display: inline-block;
    vertical-align: middle;
  }
}

.userpanel {
  cursor: pointer;
  padding: 0 20px;

  .username {
    line-height: 60px;
  }

  &:hover {
    background-color: @hover-color;
  }
}

.links {
  flex: 1;

  .row {
    display: inline-block;

    & + .row {
      margin-left: 100px;
    }

    .title {
      font-size: 1.5rem;
    }

    .item {
      margin: 10px 0;

      span {
        color: @font-color-light;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

.copys {
  display: flex;

  .left {
    flex: 1;
    color: @font-color-light;
  }

  .language {
    margin-left: 20px;
    cursor: pointer;

    &.disabled {
      font-weight: bold;
      cursor: default;
    }
  }
}

</style>
