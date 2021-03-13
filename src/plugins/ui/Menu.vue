<template>
  <ul class="menu">
    <li
      class="item"
      v-for="item of menus"
      :key="item.url"
      :class="{ active: item.url === activeUrl }">
      <router-link :to="item.url" class="link">
        <ui-text :text="item.name"></ui-text>
      </router-link>
    </li>
  </ul>
</template>

<style lang="less" scoped>

@import './styles/vars.less';

.menu {
  padding: 0;
  margin: 0;

  .item {
    display: inline-block;

    .link {
      display: block;
      margin: 0;
      height: 100%;
      padding: 0 20px;
      line-height: 60px;
      cursor: pointer;
      position: relative;
      background-color: transparent;
      text-decoration: none;
      color: @font-color;
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

      &:hover {
        background-color: @hover-color;

        &::before {
          background-color: violet;
          box-shadow: 0 0 20px violet;
        }
      }
    }

    &.active .link::before {
      background-color: @theme-color;
      box-shadow: 0 0 20px @theme-color;
    }
  }
}

</style>

<script lang="ts">
import { useRouter } from 'vue-router';
import { computed, defineComponent, toRefs } from 'vue';
import { useStore } from 'vuex';
import { MyStore } from '../../store';

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

    const activeUrl = computed(() => {
      for (const item of props.menus) {
        if (route.value.fullPath === item.url) {
          return item.url;
        }
        if (route.value.fullPath.startsWith(item.url + '/')) {
          return item.url;
        }
      }
      return '';
    });

    return {
      route,
      activeUrl,
      ...toRefs(store.state),
    };
  },
});
</script>
