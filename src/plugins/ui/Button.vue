<template>
  <button class="button" :class="{ [type]: true, text, small }" >
    <slot></slot>
  </button>
</template>

<script lang="ts">
export default {
  props: {
    type: String,
    text: Boolean,
    small: Boolean,
  },
};
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
  font-size: .9rem;
  transition: background-color .2s, color .2s;

  & + .button {
    margin-left: 20px;
  }

  &.small {
    padding: 5px 10px;
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
