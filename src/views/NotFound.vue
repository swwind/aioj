<template>
  <div class="about">
    <h1>404 NOT FOUND</h1>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { translate } from '@/i18n/translate';
import { defineComponent } from 'vue';
import { MyStore } from '@/store';
import { MutationTypes } from '@/store/mutation-types';

export default defineComponent({
  setup() {
    const store = useStore() as MyStore;

    store.commit(MutationTypes.CHANGE_SSR_STATUS, 404);
    store.commit(MutationTypes.CHANGE_SSR_TITLE, translate(store.state.i18n.lang, 'not_found'));
  },
});
</script>
