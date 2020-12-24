<template>
  <i class="icons" v-if="!text">{{ name }}</i>
  <div class="large" v-else>
    <i class="icons">{{ name }}</i>
    <div class="text">{{ text }}</div>
  </div>
</template>

<style lang="less" scoped>
@import "./styles/vars.less";

.icons {
  font-family: 'Material Icons';
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  user-select: none;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: middle;
  -webkit-font-smoothing: antialiased;
  transform: translateY(-.1em);
}

.large {
  text-align: center;
  color: @font-color-lighter;
  user-select: none;
  padding: 50px 0;

  .icons {
    font-size: 5rem;
  }
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    name: String,
    text: String,
  },
});
</script>
