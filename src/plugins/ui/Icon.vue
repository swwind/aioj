<template>
  <i class="material-icons-outlined" v-if="!text">{{ name }}</i>
  <div class="large" v-else>
    <i class="material-icons-outlined">{{ name }}</i>
    <div class="text">{{ text }}</div>
  </div>
</template>

<style lang="less" scoped>
@import "./styles/vars.less";

.material-icons-outlined {
  user-select: none;
}

.large {
  text-align: center;
  color: @font-color-lighter;
  user-select: none;
  padding: 50px 0;

  .material-icons-outlined {
    font-size: 5rem;
  }
}
</style>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    name: String,
    text: String,
  }
});
</script>