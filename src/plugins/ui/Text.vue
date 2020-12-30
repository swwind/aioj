<template>
  {{ translate(i18n.lang, text) }}
</template>

<script lang="ts">
import { translate } from '@/i18n/translate'
import { MyStore } from '@/store';
import { defineComponent, toRefs } from 'vue'
import { useStore } from 'vuex';
export default defineComponent({
  props: {
    text: String,
  },
  setup() {
    const store = useStore() as MyStore;

    return {
      translate,
      ...toRefs(store.state),
    };
  }
})
</script>