<template>
  <div class="home">
    <h1>Hello {{ accounts.username || 'werid guest' }}!</h1>
  </div>
</template>

<script lang="ts">
import { StoreState } from '@/store';
import { defineComponent, toRefs } from 'vue';
import { useStore } from 'vuex';

export default defineComponent(() => {
  const store = useStore<StoreState>();

  return {
    ...toRefs(store.state),
  };
});
</script>
