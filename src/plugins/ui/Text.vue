<template>
  <span v-if="!to" class="tag">
    <ui-icon v-if="icon" :name="icon"/>
    {{ raw ? text : translate(i18n.lang, text) }}
  </span>
  <router-link v-else :to="to" class="tag">
    <ui-icon v-if="icon" :name="icon"/>
    {{ raw ? text : translate(i18n.lang, text) }}
  </router-link>
</template>

<style lang="less" scoped>

.tag + .tag {
  margin-left: 20px;
}

</style>

<script lang="ts">
import { translate } from '../../i18n/translate';
import { MyStore } from '../../store';
import { defineComponent, toRefs } from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
    icon: String,
    to: String,
    raw: Boolean,
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
