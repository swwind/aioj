<template>
  <div class="about">
    <h1>Welcome to aioj.ac!</h1>
    <p>This is a very good AI online judging system.</p>
    <p>You can write code, send post, or fuck anything else here without any limitation.</p>
    <p>More about this project: <a href="https://github.com/attack204/AIFuckingSystem">github</a></p>
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

    store.commit(MutationTypes.CHANGE_SSR_TITLE, `${translate(store.state.i18n.lang, 'about')} - AIOJ`);
  }
});
</script>
