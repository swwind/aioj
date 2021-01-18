<template>
  <div class="code">
    <ui-select :keys="keys" v-model="lang" class="select"></ui-select>
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

  .select {
    flex: 3;
  }

  .number {
    padding: 10px 0 10px 10px;
    white-space: pre-wrap;
    font-family: monospace;
    font-size: 1.25rem;
    line-height: 1.5rem;
    text-align: right;
    user-select: none;
  }

  .text {
    flex: 9;
    font-size: 1.25rem;
    line-height: 1.5rem;
    background-color: @card-background-color;
    color: @font-color;
    outline: none;
    border: none;
    min-height: 400px;
    padding: 10px;
    resize: none;
    overflow-y: hidden;
    overflow-x: auto;
    white-space: nowrap;
  }
}

</style>

<script lang="ts">
import { translate } from '@/i18n/translate';
import { defineComponent, ref, toRefs, watch } from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const { modelValue } = toRefs(props);
    const code = ref(modelValue.value.code ?? '');
    const active = ref(false);
    const lang = ref(modelValue.value.lang ?? 0);
    const rows = ref(code.value.split('\n').length);
    const keys = ['C', 'C++', 'Python', 'JavaScript (NodeJS)', 'Java (Java SE)', 'TypeScript (Deno)', 'Haskell'];

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
      translate,
      ...toRefs(store.state),
    };
  },
});
</script>
