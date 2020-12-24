<template>
  <div class="input" :class="{ active }">
    <ui-icon v-if="icon" :name="icon" class="icon" />
    <input
      :type="type"
      v-model="value"
      class="inner-input"
      :placeholder="placeholder"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      @keydown="handleKeydown($event)"
    >
  </div>
</template>

<style lang="less" scoped>
@import "./styles/vars.less";

.input {
  height: 40px;
  background-color: @background-color;
  display: flex;
  border: 2px solid @background-color;
  border-radius: 5px;

  transition: background-color .2s, border-color .2s;

  .icon {
    line-height: 40px;
    font-size: 1rem;
    margin: 0 7px;
    color: @font-color-lighter;
  }

  .inner-input {
    flex: 1;
    font-size: .9rem;
    height: 100%;
    box-sizing: border-box;
    border: none;
    outline: none;
    background-color: transparent;
    padding: 0;
    margin: 0;
    color: @font-color-light;

    &::placeholder {
      color: @font-color-lighter;
    }
  }

  &.active {
    background-color: @card-background-color;
    border-color: @theme-color;
  }
}
</style>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
export default defineComponent({
  props: {
    icon: String,
    type: String,
    placeholder: String,
  },
  emits: ['update:modelValue', 'change', 'keydown'],
  setup(props, ctx) {
    const value = ref('');
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
    const handleChange = () => {
      ctx.emit('change');
    };

    const handleKeydown = (e: KeyboardEvent) => {
      ctx.emit('keydown', e);
    };

    return {
      value,
      active,
      handleFocus,
      handleBlur,
      handleChange,
      handleKeydown,
    };
  },
});
</script>
