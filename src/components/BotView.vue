<template>
  <ui-header :title="data.bot.name">
    <template #route1>
      <ui-text text="bot" />
    </template>
    <ui-text :text="data.bot.name" row />
  </ui-header>

  <ui-sidebar v-if="ssr.status === 200">
    <template #sidebar>
      <ui-card nopadding>
        <template #header>
          <ui-text text="operations" />
        </template>
        <ui-listed-button icon="download" :href="`${cdn}/f/${data.bot.fid}`">
          <ui-text text="Download" />
        </ui-listed-button>
        <ui-listed-button icon="location-arrow">
          <ui-text text="Start Round" />
        </ui-listed-button>
        <ui-listed-button icon="location-arrow" :to="`/p/${data.bot.pid}`">
          <ui-text text="Go to Problem" />
        </ui-listed-button>
        <ui-listed-hr v-if="isMybot || isAdmin" />
        <ui-listed-button icon="edit">
          <ui-text text="Edit" />
        </ui-listed-button>
      </ui-card>
    </template>
    <ui-card notitle>
      <ui-text :text="`v${data.bot.version}`" row icon="code-branch" />
      <ui-text :text="data.bot.author" row icon="user" />
      <ui-content :text="data.bot.description" markdown class="margin"></ui-content>
    </ui-card>
  </ui-sidebar>
</template>

<style lang="less" scoped>

</style>

<script lang="ts">
import { MyStore } from '@/store';
import { ActionTypes } from '@/store/action-types';
import { computed, defineComponent, toRefs, watch } from 'vue';
import { useStore } from 'vuex';
import config from '../../config.json';

export default defineComponent({
  props: {
    bid: {
      type: Number,
      required: true,
    },
  },
  async setup(props) {
    const { bid } = toRefs(props);
    const store = useStore() as MyStore;

    const preload = async () => {
      await store.dispatch(ActionTypes.FETCH_BOT_DATA, bid);
    };
    watch(bid, preload);
    await preload();

    const isMybot = computed(() => store.state.data.bot.author === store.state.accounts.username);
    const isAdmin = computed(() => store.state.accounts.admin);

    return {
      isMybot,
      isAdmin,
      ...toRefs(store.state),
      cdn: config.port === 443 ? '//' + config.cdn : '',
    };
  },
});
</script>
