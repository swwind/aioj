<template>
  <div class="select">
    <div
      class="options"
      v-for="(key, index) in keys"
      :key="index"
      :class="{ selected: index === selected }"
      @click="handleClick(index)">
      {{ key }}
    </div>
  </div>
</template>

<style lang="less" scoped>

@import "./styles/vars.less";

.select {
  background-color: @background-color;
  color: @font-color;

  .options {
    display: block;
    padding: 10px 20px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      width: 3px;
      left: 0;
      top: 0;
      height: 100%;
      transition: background-color .2s, box-shadow .2s;
      background-color: transparent;
      box-shadow: 0 0 20px transparent;
    }

    &:hover {
      background-color: @hover-color;

      &::before {
        background-color: @theme-color;
        box-shadow: 0 0 20px @theme-color;
      }
    }

    &.selected {
      background-color: @active-color;

      &::before {
        background-color: violet;
        box-shadow: 0 0 20px violet;
      }
    }
  }
}

</style>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  props: {
    modelValue: Number,
    keys: Array,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const selected = ref(props.modelValue ?? 0);
    const handleClick = (newv: number) => {
      emit('update:modelValue', newv);
      selected.value = newv;
    };

    return {
      selected,
      handleClick,
    };
  },
});
</script>
