<template>
  <ui-card notitle>
    <ui-icon
      v-if="!data.regions.length"
      name="unarchive"
      :text="translate(i18n.lang, 'no_regions')"
    />
    <div class="region-item" v-for="region of data.regions" :key="region.region" v-else>
      <router-link :to="`/r/${region.region}`" class="title">{{ region.title }}</router-link>
      <p class="desc">{{ region.description }}</p>
    </div>
  </ui-card>
  <ui-card class="create" v-if="accounts.admin">
    <template #header>
      {{ translate(i18n.lang, 'create_new_region') }}
    </template>
    <div class="form">
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
  </ui-card>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue';
import { useStore } from 'vuex';
import { MyStore } from '@/store';
import { translate } from '@/i18n/translate';
import { MutationTypes } from '@/store/mutation-types';
import { ActionTypes } from '@/store/action-types';

export default defineComponent({
  async setup() {
    const store = useStore() as MyStore;
    store.commit(MutationTypes.CHANGE_SSR_TITLE, translate(store.state.i18n.lang, 'regions'));

    const region = ref('');
    const title = ref('');
    const description = ref('');

    const handleCreateRegion = async () => {
      await store.dispatch(ActionTypes.CREATE_REGION, {
        region,
        title,
        description,
      });
    };

    await store.dispatch(ActionTypes.FETCH_REGIONS_DATA);

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
  margin: 20px 0;
  padding: 10px 20px;
  transition: background-color .2s;

  &:hover {
    background-color: #0000000c;
  }

  .title {
    margin: 0;
    font-size: 1.5rem;
  }

  .desc {
    margin: 0;
    margin-top: 10px;
    font-size: .8rem;
    color: #666;
  }
}

.create {
  margin-top: 20px;

  .form {
    margin: 20px 0;
  }
}

.form-item {
  margin-bottom: 20px;
}

</style>
