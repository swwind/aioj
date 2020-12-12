<template>
  <h1>{{ translate(i18n.lang, 'regions') }}</h1>
  <div class="region-list">
    <el-alert type="warning" v-if="!data.regions.length">{{ translate(i18n.lang, 'no_regions') }}</el-alert>
    <div class="region-item" v-for="region of data.regions" :key="region.region">
      <router-link :to="`/r/${region.region}`" class="title">{{ region.title }}</router-link>
      <p class="desc">{{ region.description }}</p>
    </div>
  </div>
  <div class="create" v-if="accounts.admin">
    <h2>{{ translate(i18n.lang, 'create_new_region') }}</h2>
    <el-input
      type="text"
      class="form-item"
      v-model="region"
      :placeholder="translate(i18n.lang, 'region_url')" />
    <el-input
      type="text"
      class="form-item"
      v-model="title"
      :placeholder="translate(i18n.lang, 'region_title')" />
    <el-input
      type="textarea"
      class="form-item"
      v-model="description"
      :placeholder="translate(i18n.lang, 'region_desc')" />
    <div class="buttonset">
      <el-button
        type="primary"
        @click="handleCreateRegion">
        {{ translate(i18n.lang, 'post') }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue';
import { handleNetworkRequestError, preventSSRFetchTwice } from '@/utils';
import { useStore } from 'vuex';
import { ActionTypes, MutationTypes, StoreState } from '@/store';
import { translate } from '@/i18n/translate';
import { useRouter } from 'vue-router';
import { API } from '@/api';

export default defineComponent({
  async setup() {
    const store = useStore<StoreState>();
    const router = useRouter();
    store.commit(MutationTypes.CHANGE_SSR_TITLE, `${translate(store.state.i18n.lang, 'regions')} - AIOJ`);

    const region = ref('');
    const title = ref('');
    const description = ref('');

    const handleCreateRegion = async () => {
      const result = await API.createRegion(region.value, title.value, description.value);
      if (result.status === 200) {
        router.push(`/r/${region.value}`);
      } else {
        handleNetworkRequestError(store, result);
      }
    };

    if (preventSSRFetchTwice()) {
      await store.dispatch(ActionTypes.FETCH_REGIONS_DATA);
    }

    return {
      translate,
      region,
      title,
      description,
      handleCreateRegion,

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

.form-item {
  margin-bottom: 20px;
}

</style>
