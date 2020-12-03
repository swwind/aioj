<template>
  <h1>Regions</h1>
  <div class="region-list">
    <el-alert type="warning" v-if="!data.regions.length">No regions yet</el-alert>
    <div class="region-item" v-for="region of data.regions" :key="region.region">
      <router-link :to="`/r/${region.region}`" class="title">{{ region.title }}</router-link>
      <p class="desc">{{ region.description }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { getRegions } from '@/api/forum';
import { defineComponent, toRefs } from 'vue';
import { handleNetworkRequestError } from '@/utils';
import { useStore } from 'vuex';
import { MutationTypes, StoreState } from '@/store';

export default defineComponent({
  async setup() {
    const store = useStore<StoreState>();

    const result = await getRegions();
    if (result.status === 200) {
      store.commit(MutationTypes.FETCH_REGION_LIST, result.regions);
    } else {
      handleNetworkRequestError(store.state.i18n.lang, result);
    }

    return {
      ...toRefs(store.state),
    };
  },
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

.region-item {
  padding: 10px 20px;
  border-left: 2px solid #66ccff;

  .title {
    margin: 0;
    font-size: 1.5rem;
  }

  .desc {
    margin: 0;
    margin-top: 10px;
    font-size: .8rem;
  }
}

</style>
