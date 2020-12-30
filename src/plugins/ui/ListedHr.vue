<template>
  <div class="hr">
    <div class="line"></div>
  </div>
</template>

<style lang="less" scoped>
@import './styles/vars.less';

.hr {
  padding: 5px 10px;
  
  .line {
    height: 1px;
    width: 100%;
    background-color: @font-color-lighter;
  }
}
</style>