<template>
  <div v-if="markdown" class="marked" v-html="santinizeMarked(text ?? '')"></div>
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
/* eslint-disable no-undef */
import { santinizeMarked } from '../../utils';
import { defineComponent, onMounted } from 'vue';
export default defineComponent({
  props: {
    text: String,
    markdown: Boolean,
  },
  setup() {
    onMounted(() => {
      if (flvjs.isSupported()) {
        const elems = document.querySelectorAll<HTMLMediaElement>('video[data-flv-src]');
        elems.forEach((elem) => {
          const url = elem.getAttribute('data-flv-src');
          elem.removeAttribute('data-flv-src');
          if (!url) return;
          const player = flvjs.createPlayer({ type: 'flv', url });
          player.attachMediaElement(elem);
          player.load();
        });
      }
    });

    return {
      santinizeMarked,
    };
  },
});
</script>
