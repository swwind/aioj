<template>
  <ui-header />
  <ui-card notitle>
    <ui-icon
      v-if="!data.problems.length"
      name="snowflake"
      text="no_problems"
    />
    <div class="item" v-for="problem of data.problems" :key="problem.pid" v-else>
      <router-link :to="`/p/${problem.pid}`" class="title">{{ problem.title }}</router-link>
    </div>
  </ui-card>
</template>

<style lang="less" scoped>

</style>

<script lang="ts">
import { translate } from '@/i18n/translate';
import { MyStore } from '@/store';
import { MutationTypes } from '@/store/mutation-types';
import { defineComponent, toRefs } from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
  async setup() {
    const store = useStore() as MyStore;

    store.commit(MutationTypes.CHANGE_SSR_TITLE, translate(store.state.i18n.lang, 'problems'));

    return {
      ...toRefs(store.state),
    };
  },
});
</script>
