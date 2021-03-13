<template>
  <ui-header title="not_found" translate>
    <ui-text text="not_found" />
  </ui-header>

  <div class="about">
    <h1>404 NOT FOUND</h1>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent } from 'vue';
import { MyStore } from '../store';
import { MutationTypes } from '../store/mutation-types';

export default defineComponent({
  setup() {
    const store = useStore() as MyStore;

    store.commit(MutationTypes.CHANGE_SSR_STATUS, 404);
  },
});
</script>
