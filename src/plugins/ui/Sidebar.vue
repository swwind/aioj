<template>
  <div class="container">
    <div class="main">
      <slot></slot>
    </div>
    <div class="sidebar">
      <slot name="sidebar"></slot>
    </div>
  </div>
</template>

<style lang="less" scoped>

.container {
  width: 100%;
  display: flex;
  flex-direction: row;

  .sidebar {
    width: 25%;
    margin-left: 20px;
  }

  .main {
    flex: 1;
  }
}

</style>
