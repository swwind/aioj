<template>
  <button class="button" :class="{ [type]: true, text, small, disabled }" @click="handleClick($event)">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    type: String,
    text: Boolean,
    small: Boolean,
    disabled: Boolean,
  },
  emits: ['click'],
  setup(props, ctx) {
    const handleClick = (e: MouseEvent) => {
      if (!props.disabled) {
        ctx.emit('click', e);
      }
    };

    return {
      handleClick,
    };
  },
});
</script>

<style scoped lang="less">

@import './styles/vars.less';

.button {
  outline: none;
  border: none;
  padding: 10px 20px;
  background-color: transparent;
  border: 1px solid @font-color;
  color: @font-color;
  display: inline-block;
  cursor: pointer;
  border-radius: 5px;
  font-size: .9rem;
  transition: background-color .2s, color .2s;

  & + .button {
    margin-left: 20px;
  }

  &.small {
    padding: 9px 15px;
    font-size: 12px;
  }

  &.disabled {
    cursor: not-allowed;
    background-color: grey !important;
    border-color: grey !important;
  }

  &.primary {
    background-color: @blue;
    border-color: @blue;
    color: white;

    &:hover {
      background-color: @lighten-blue;
    }

    &:active {
      background-color: @lighten-more-blue;
    }
  }

  &.warning {
    background-color: @yellow;
    border-color: @yellow;
    color: black;

    &:hover {
      background-color: @lighten-yellow;
    }

    &:active {
      background-color: @lighten-more-yellow;
    }
  }

  &.danger {
    background-color: @red;
    border-color: @red;
    color: white;

    &:hover {
      background-color: @lighten-red;
    }

    &:active {
      background-color: @lighten-more-red;
    }
  }

  &.text {
    background-color: transparent;
    border-color: transparent;

    &:hover {
      background-color: transparent;
    }

    &.primary {
      color: @blue;
    }
    &.warning {
      color: @yellow;
    }
    &.danger {
      color: @red;
    }
  }
}

</style>
