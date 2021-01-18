<template>
  <div class="input" :class="{ active, wrong }">
    <ui-icon v-if="icon" :name="icon" class="icon" />
    <input
      :type="type"
      v-model="value"
      class="inner-input"
      :placeholder="translate(i18n.lang, placeholder)"
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
    margin-left: 10px;
    width: 20px;
    text-align: center;
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
    padding: 0 10px;
    margin: 0;
    color: @font-color-light;

    &::placeholder {
      color: @font-color-lighter;
    }
  }

  &.wrong {
    background-color: @card-background-color;
    border-color: @red;
  }

  &.active {
    background-color: @card-background-color;
    border-color: @theme-color;
  }
}
</style>

<script lang="ts">
import { translate } from '@/i18n/translate';
import { defineComponent, ref, toRefs, watch } from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
  props: {
    icon: String,
    type: String,
    placeholder: String,
    modelValue: {
      type: String,
      required: true,
    },
    required: Boolean,
  },
  emits: ['update:modelValue', 'change', 'keydown'],
  setup(props, ctx) {
    const { modelValue } = toRefs(props);
    const value = ref(modelValue.value);
    const active = ref(false);
    const wrong = ref(false);

    const updateWrongCheck = () => {
      wrong.value = props.required && !value.value;
    }
    watch(value, (newvalue) => {
      updateWrongCheck();
      ctx.emit('update:modelValue', newvalue);
    });
    watch(modelValue, (newvalue) => {
      value.value = newvalue;
    });


    const handleFocus = () => {
      updateWrongCheck();
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

    const store = useStore();

    return {
      value,
      wrong,
      active,
      translate,
      handleFocus,
      handleBlur,
      handleChange,
      handleKeydown,
      ...toRefs(store.state),
    };
  },
});
</script>
