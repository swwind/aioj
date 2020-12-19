<template>
  <ui-card class="about">
    <template #header>
      Welcome to aioj.ac!
    </template>
    <p>This is a very good AI online judging system.</p>
    <p>You can write code, send post, or fuck anything else here without any limitation.</p>
    <p>More about this project: <a href="https://github.com/swwind/aioj" target="_blank">github</a></p>
  </ui-card>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { MyStore } from '@/store';
import { translate } from '@/i18n/translate';
import { defineComponent } from 'vue';
import { MutationTypes } from '@/store/mutation-types';

export default defineComponent({
  setup() {
    const store = useStore() as MyStore;

    store.commit(MutationTypes.CHANGE_SSR_TITLE, `${translate(store.state.i18n.lang, 'about')}`);
  },
});
</script>
