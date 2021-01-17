<template>
  <input type="file" :accept="accept" :multiple="multiple" @change="handleSelect" ref="input">
</template>

<style lang="less" scoped>

</style>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  props: {
    multiple: Boolean,
    accept: String,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const input = ref<HTMLInputElement | null>(null);

    const handleSelect = () => {
      const elem = input.value;
      if (elem === null) {
        return;
      }

      if (props.multiple) {
        emit('update:modelValue', elem.files);
      } else {
        emit('update:modelValue', elem.files?.[0]);
      }
    };

    return {
      input,
      handleSelect,
    };
  },
});
</script>
