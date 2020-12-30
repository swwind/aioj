<template>
  <div v-if="markdown" class="marked" v-html="santinizeMarked(text)"></div>
  <div v-else class="raw" v-text="text"></div>
</template>

<style lang="less">
.marked {
  word-wrap: break-word;

  & > :first-child {
    margin-top: 0;
  }

  & > :last-child {
    margin-bottom: 0;
  }

  video, audio, img {
    max-width: 100%;
  }
}

.raw {
  white-space: pre-wrap;
}
</style>

<script lang="ts">
import { santinizeMarked } from '@/utils';
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
    markdown: Boolean,
  },
  setup() {
    return {
      santinizeMarked,
    };
  },
});
</script>
