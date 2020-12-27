<template>
  <i class="icons" :class="`${regular ? 'far' : 'fas'} fa-${name}${right ? ' right' : '' }`" v-if="!text"></i>
  <div class="large" v-else>
    <i class="icons" :class="`${regular ? 'far' : 'fas'} fa-${name}${right ? ' right' : '' }`"></i>
    <div class="text">{{ text }}</div>
  </div>
</template>

<style lang="less" scoped>
@import "./styles/vars.less";

.icons {
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  user-select: none;
  font-style: normal;
  font-variant: normal;
  text-transform: none;
  line-height: inherit;
  vertical-align: baseline;
  -webkit-font-smoothing: antialiased;
  font-size: .9rem;

  &.right {
    margin-right: 5px;
  }
}

.large {
  text-align: center;
  color: @font-color-lighter;
  user-select: none;
  padding: 50px 0;

  .icons {
    font-size: 5rem;
  }

  .text {
    margin-top: 10px;
  }
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    name: String,
    text: String,
    regular: Boolean,
    right: Boolean,
  },
});
</script>
