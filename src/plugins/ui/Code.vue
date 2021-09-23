<template>
  <div class="code" :class="{ locked }">
    <ui-select :keys="keys" v-model="lang" class="select" v-if="!locked"></ui-select>
    <div class="number">{{ new Array(rows).fill(0).map((_, i) => i+1).join('\n') }}</div>
    <textarea v-model="code" class="text"></textarea>
  </div>
</template>

<style lang="less" scoped>
@import "./styles/vars.less";

.code {
  display: flex;
  border: 5px solid @background-color;
  border-left: none;

  &.locked {
    border-left: 5px solid @background-color;
  }

  .select {
    flex: 3;
  }

  .number {
    padding: 10px 0 10px 10px;
    white-space: pre-wrap;
    font-family: monospace;
    font-size: 1rem;
    line-height: 1.25rem;
    text-align: right;
    user-select: none;
  }

  .text {
    flex: 9;
    font-size: 1rem;
    line-height: 1.25rem;
    background-color: @card-background-color;
    color: @font-color;
    outline: none;
    border: none;
    min-height: 400px;
    padding: 10px;
    resize: none;
    overflow-y: hidden;
    overflow-x: auto;
  }
}

</style>

<script lang="ts">
import { defineComponent, ref, toRefs, watch } from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    locked: Boolean,
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const { modelValue } = toRefs(props);
    const code = ref(modelValue.value.code ?? '');
    const active = ref(false);
    const lang = ref(modelValue.value.lang ?? 'cpp');
    const rows = ref(code.value.split('\n').length);
    const keys = [{
      name: 'C',
      value: 'c',
    }, {
      name: 'C++',
      value: 'cpp',
    }, {
      name: 'Java (SE 8)',
      value: 'java',
    }, {
      name: 'Python 2',
      value: 'py2',
    }, {
      name: 'Python 3',
      value: 'py3',
    }, {
      name: 'Haskell',
      value: 'hs',
    }, {
      name: 'Clojure',
      value: 'clj',
    }, {
      name: 'JavaScript (node.js 14)',
      value: 'js',
    }, {
      name: 'TypeScript (deno)',
      value: 'ts',
    }];

    watch(code, () => {
      ctx.emit('update:modelValue', { lang: lang.value, code: code.value });
      rows.value = code.value.split('\n').length;
    });
    watch(lang, () => {
      ctx.emit('update:modelValue', { lang: lang.value, code: code.value });
    });
    watch(modelValue, (newvalue) => {
      if (typeof newvalue.code === 'string') {
        code.value = newvalue.code;
      }
      if (typeof newvalue.lang === 'number') {
        lang.value = newvalue.lang;
      }
    });

    const store = useStore();

    return {
      code,
      rows,
      lang,
      keys,
      active,
      ...toRefs(store.state),
    };
  },
});
</script>
