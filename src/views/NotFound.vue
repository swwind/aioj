<template>
  <div class="about">
    <h1>404 NOT FOUND</h1>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { MutationTypes, StoreState } from '@/store';
import { translate } from '@/i18n/translate';
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const store = useStore<StoreState>();

    store.commit(MutationTypes.CHANGE_SSR_STATUS, 404);
    store.commit(MutationTypes.CHANGE_SSR_TITLE, `${translate(store.state.i18n.lang, 'not_found')} - AIOJ`);
  }
});
</script>
