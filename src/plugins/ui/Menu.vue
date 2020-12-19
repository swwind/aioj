<template>
  <ul class="menu">
    <li
      class="item"
      v-for="item of menus"
      :key="item.url"
      @click="jumpTo(item)"
      :class="{ active: item.url === activeUrl }">
      {{ translate(i18n.lang, item.name) }}
    </li>
  </ul>
</template>

<style lang="less" scoped>

@import './styles/vars.less';

.menu {
  padding: 0;
  margin: 0;

  .item {
    margin: 0;
    display: inline-block;
    height: 100%;
    padding: 0 20px;
    line-height: 60px;
    cursor: pointer;
    position: relative;
    background-color: transparent;
    transition: background-color .2s;

    &::before {
      content: '';
      width: 100%;
      height: 3px;
      background-color: transparent;
      box-shadow: 0 0 20px transparent;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      transition: background-color .2s, box-shadow .2s;
    }

    &.active::before {
      background-color: @theme-color;
      box-shadow: 0 0 20px @theme-color;
    }

    &:hover {
      background-color: @hover-color;

      &::before {
        background-color: violet;
        box-shadow: 0 0 20px violet;
      }
    }
  }
}

</style>

<script lang="ts">
import { useRouter } from 'vue-router';
import { computed, defineComponent, ref, toRefs } from 'vue';
import { translate } from '@/i18n/translate';
import { useStore } from 'vuex';
import { MyStore } from '@/store';

type MenuItem = {
  name: string;
  url: string;
}

export default defineComponent({
  props: {
    menus: {
      type: Array as () => Array<MenuItem>,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const store = useStore() as MyStore;
    const route = router.currentRoute;

    const jumpTo = (item: MenuItem) => {
      router.push(item.url);
    }

    const activeUrl = computed(() => {
      for (const item of props.menus) {
        if (route.value.fullPath === item.url) {
          return item.url;
        }
        if (item.url.length > 1 && route.value.fullPath.startsWith(item.url)) {
          return item.url;
        }
      }
      return '';
    });

    return {
      jumpTo,
      route,
      activeUrl,
      translate,
      ...toRefs(store.state),
    }
  }
})
</script>