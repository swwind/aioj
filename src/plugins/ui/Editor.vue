<template>
  <div class="editor" :class="{ active }">
    <div class="navi">
      <div
        class="li"
        :class="{ active: choose === 0 }"
        tabindex="0"
        @focus="handleFocus"
        @blur="handleBlur"
        @click="handleSwitch(0)">Markdown</div>
      <div
        class="li"
        :class="{ active: choose === 1 }"
        tabindex="0"
        @focus="handleFocus"
        @blur="handleBlur"
        @click="handleSwitch(1)">Preview</div>
      <div class="rest"></div>
    </div>
    <div class="main">
      <textarea
        v-if="choose === 0"
        v-model="value"
        class="textarea"
        :placeholder="placeholder"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <div v-else class="preview" v-html="santinizeMarked(value)"></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import "./styles/vars.less";

.editor {

  .navi {
    display: flex;

    .li {
      display: inline-block;
      padding: 10px 20px;
      cursor: pointer;
      background-color: @card-background-color;
      border: 2px solid @card-background-color;
      outline: none;

      &.active {
        cursor: default;
        font-weight: bold;
        background-color: @background-color;
        border: 2px solid @background-color;
      }
    }

    .rest {
      flex: 1;
    }
  }

  .main {
    padding: 10px;
    border: 2px solid @background-color;
    background-color: @background-color;

    .textarea {
      min-height: 200px;
      width: 100%;
      resize: vertical;
      box-sizing: border-box;
      background-color: transparent;
      border: none;
      outline: none;
      color: @font-color;
    }

    .preview {
      min-height: 200px;
    }
  }

  &.active {

    .main {
      background-color: @card-background-color;
      border-color: @theme-color;
      border-top: none;
    }

    .li, .rest {
      border-bottom: 2px solid @theme-color;

      &.active {
        background-color: @card-background-color;
        border: 2px solid @theme-color;
        border-bottom: none;
      }
    }
  }
}
</style>

<script lang="ts">
import { santinizeMarked } from '@/utils';
import { defineComponent, ref, watch } from 'vue';
export default defineComponent({
  props: {
    placeholder: String,
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const value = ref('');
    const choose = ref(0);
    const active = ref(false);

    watch(value, (newvalue) => {
      ctx.emit('update:modelValue', newvalue);
    });

    const handleFocus = () => {
      active.value = true;
    };
    const handleBlur = () => {
      active.value = false;
    };
    const handleSwitch = (c: number) => {
      choose.value = c;
    };

    return {
      value,
      choose,
      active,
      handleSwitch,
      santinizeMarked,
      handleFocus,
      handleBlur,
    };
  },
});
</script>
