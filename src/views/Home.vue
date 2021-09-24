<template>
  <ui-header title="home" translate>
    <ui-text text="home" />
  </ui-header>

  <ui-card>
    <template #header>
      {{ accounts.username ? `Good morning ${accounts.username}!` : 'Welcome to AIOJ!' }}
    </template>
    <p>Read <router-link to="/about">about</router-link> and <router-link to="/eula">eula</router-link> page first. This website is almost finished.</p>
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
