<template>
  <el-card shadow="hover">
    <template #header>
      <h1 v-if="accounts.username">Hello {{ accounts.username }}</h1>
      <h1 v-else>Welcome to AIOJ!</h1>
    </template>
    <p>Read the document <a href="/about">here</a>, this website is still WIP.</p>
  </el-card>
</template>

<script lang="ts">
import { translate } from '@/i18n/translate';
import { MutationTypes, StoreState } from '@/store';
import { defineComponent, toRefs } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore<StoreState>();

    store.commit(MutationTypes.CHANGE_SSR_TITLE, `${translate(store.state.i18n.lang, 'home')} - AIOJ`);
    store.commit(MutationTypes.CHANGE_SSR_META, {
      description: translate(store.state.i18n.lang, 'description'),
    });

    return {
      ...toRefs(store.state),
    };
  },
});
</script>
