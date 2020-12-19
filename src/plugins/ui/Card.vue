<template>
  <div class="card">
    <header v-if="!notitle">
      <h2 class="title">
        <slot name="header"></slot>
      </h2>
    </header>
    <div class="container" v-if="!nopadding">
      <slot></slot>
    </div>
    <slot v-else></slot>
  </div>
</template>

<style lang="less" scoped>

@import './styles/vars.less';

.card {
  background-color: @card-background-color;
  border-radius: 5px;

  .title {
    font-weight: normal;
    padding: 20px 5px 5px 20px;
    margin: 0;
  }

  .container {
    padding: 20px;

    & > :first-child {
      margin-top: 0;
    }

    & > :last-child {
      margin-bottom: 0;
    }
  }

  & + .card {
    margin-top: 20px;
  }
}

</style>

<script lang="ts">
export default {
  props: {
    notitle: Boolean,
    nopadding: Boolean,
  }
}
</script>