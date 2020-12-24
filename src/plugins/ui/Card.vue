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

  opacity: 0;
  transform: translate(0, 20px);
  animation-name: fade-up-in;
  animation-duration: .5s;
  animation-fill-mode: forwards;

  box-shadow: rgb(200, 200, 200) 0 0 20px;

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
    animation-delay: .1s;

    & + .card {
      animation-delay: .2s;

      & + .card {
        animation-delay: .3s;

        & + .card {
          animation-delay: .4s;
        }
      }
    }
  }
}

@media (prefers-color-scheme: dark) {
  .card {
    box-shadow: none;
  }
}

@keyframes fade-up-in {
  to {
    opacity: 1;
    transform: translate(0, 0);
  }
}

</style>

<script lang="ts">
export default {
  props: {
    notitle: Boolean,
    nopadding: Boolean,
  },
};
</script>
