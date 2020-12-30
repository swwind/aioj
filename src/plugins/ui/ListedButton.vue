<template>
  <router-link v-if="to" :to="to" class="button">
    <ui-icon :name="icon" class="icon"></ui-icon>
    <slot></slot>
  </router-link>
  <div v-else class="button" :class="{ active, danger }">
    <ui-icon :name="icon" class="icon"></ui-icon>
    <slot></slot>
  </div>
</template>

<style lang="less" scoped>
@import './styles/vars.less';

.button {
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color .2s;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  display: block;
  color: @font-color;

  &::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 100%;
    box-shadow: 0 0 10px transparent;
    background-color: transparent;
    transition: box-shadow .2s, background-color .2s;
  }

  &:hover {
    background-color: @hover-color;

    &::before {
      box-shadow: 0 0 10px @theme-color;
      background-color: @theme-color;
    }
  }

  &.active {
    background-color: @active-color;

    &::before {
      box-shadow: 0 0 10px violet;
      background-color: violet;
    }
  }

  &.danger {
    color: @red;

    &:hover::before {
      box-shadow: 0 0 10px @red;
      background-color: @red;
    }
  }

  .icon {
    width: 20px;
    margin-right: 10px;
  }
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    icon: String,
    active: Boolean,
    danger: Boolean,
    to: String,
  },
});
</script>
