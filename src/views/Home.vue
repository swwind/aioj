<template>
  <div class="home">
    <h1>Hello {{ accounts.username || 'werid guest' }}!</h1>
  </div>
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
