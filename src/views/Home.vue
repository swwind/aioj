<template>
  <ui-header title="home" translate>
    <ui-text text="home" />
  </ui-header>

  <ui-card>
    <template #header>
      {{ accounts.username ? `Hello ${accounts.username}` : 'Welcome to AIOJ!' }}
    </template>
    <p>Read the document <a href="/about">here</a>, this website is still WIP.</p>
  </ui-card>
</template>

<script lang="ts">
import { translate } from '../i18n/translate';
import { MyStore } from '../store';
import { MutationTypes } from '../store/mutation-types';
import { defineComponent, toRefs } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore() as MyStore;

    store.commit(MutationTypes.CHANGE_SSR_META, {
      description: translate(store.state.i18n.lang, 'description'),
    });

    return {
      ...toRefs(store.state),
    };
  },
});
</script>
