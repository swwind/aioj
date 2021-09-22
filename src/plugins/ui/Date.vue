<template>
  <ui-text :text="text" icon="calendar-alt" :raw="!!time" />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
export default defineComponent({
  props: {
    time: Number,
  },
  setup(props) {
    const text = computed(() => {
      if (!props.time) {
        return 'before_the_big_bang';
      }
      const date = new Date(props.time);
      const day = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];

      return `A.D. ${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} (${day}) ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    });

    return { text };
  },
});
</script>
