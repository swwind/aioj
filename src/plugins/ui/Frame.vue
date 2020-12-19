<template>
  <div class="fixed-header fw">
    <slot name="fixed"></slot>
  </div>
  <div class="container">
    <header class="header fw">
      <slot name="header"></slot>
    </header>
    <main class="main fw">
      <slot></slot>
    </main>
    <footer class="footer fw">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<style scoped lang="less">

@import './styles/vars.less';

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 60px;
  z-index: 20;

  display: flex;
  flex-direction: row;

  background-color: @card-background-color;
}

.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  
  .header {
    padding-top: 60px;
    height: 220px;
    box-sizing: border-box;
  }

  .main {
    flex: 1;
    background-color: @background-color;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .footer {
    padding-top: 20px;
    padding-bottom: 20px;
    height: 300px;
    background-color: @card-background-color;
    display: flex;
    flex-direction: column;
  }
}

.fw {
  padding: 0 16px;
  box-sizing: border-box;
}

@media only screen and (min-width: 1112px) {
  .fw {
    padding: 0 calc((100% - 1080px) / 2);
  }
}

</style>
