<template>
  <span v-if="!to">
    <ui-icon v-if="icon" :name="icon"/>
    {{ row ? text : translate(i18n.lang, text) }}
  </span>
  <router-link v-else :to="to">
    <ui-icon v-if="icon" :name="icon"/>
    {{ row ? text : translate(i18n.lang, text) }}
  </router-link>
</template>

<script lang="ts">
import { translate } from '@/i18n/translate';
import { MyStore } from '@/store';
import { defineComponent, toRefs } from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
  props: {
    text: String,
    icon: String,
    to: String,
    row: Boolean,
  },
  setup() {
    const store = useStore() as MyStore;

    return {
      translate,
      ...toRefs(store.state),
    };
  },
});
</script>
