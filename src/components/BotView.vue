<template>
  <ui-header :title="data.bot.name">
    <template #route1>
      <ui-text text="bot" />
    </template>
    <ui-text :text="data.bot.name" row />
  </ui-header>

  <ui-sidebar>
    <template #sidebar>
      <ui-card nopadding>
        <template #header>
          <ui-text text="operations" />
        </template>
        <ui-listed-button icon="download" :to="`/f/${data.bot.fid}`">
          <ui-text text="Download" />
        </ui-listed-button>
        <ui-listed-button icon="location-arrow">
          <ui-text text="Start Round" />
        </ui-listed-button>
      </ui-card>
    </template>
    <ui-card notitle>
      <ui-text :text="`v${data.bot.version}`" row />
      <ui-content :text="data.bot.description" markdown class="margin"></ui-content>
    </ui-card>
  </ui-sidebar>
</template>

<style lang="less" scoped>

</style>

<script lang="ts">
import { MyStore } from '@/store';
import { ActionTypes } from '@/store/action-types';
import { defineComponent, toRefs, watch } from 'vue';
import { useStore } from 'vuex';
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

    return {
      ...toRefs(store.state),
    };
  },
});
</script>
