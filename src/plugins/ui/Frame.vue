<template>
  <div class="container">
    <main class="main fw">
      <slot></slot>
    </main>
    <footer class="footer fw">
      <slot name="footer"></slot>
    </footer>
  </div>
  <div class="fixed-header fw">
    <slot name="fixed"></slot>
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

  display: flex;
  flex-direction: row;

  background-color: @card-background-color;

  box-shadow: rgb(200, 200, 200) 0 0 20px;
}

@media (prefers-color-scheme: dark) {
  .fixed-header {
    box-shadow: none;
  }
}

.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .main {
    flex: 1;
    background-color: @background-color;
    padding-top: 120px;
    padding-bottom: 60px;
  }

  .footer {
    padding-top: 20px;
    padding-bottom: 20px;
    height: 250px;
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
