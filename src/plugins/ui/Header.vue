<template>
  <p class="breadcrumbs">
    <span class="breadcrumb" v-for="subtitle of ssr.title.slice(0, -1)" :key="subtitle.name">
      <router-link v-if="subtitle.url" :to="subtitle.url">{{ subtitle.name }}</router-link>
      <span v-else>{{ subtitle.name }}</span>
    </span>
  </p>
  <h1 v-if="ssr.title.length" class="title">{{ ssr.title[ssr.title.length - 1].name }}</h1>
</template>

<style lang="less" scoped>

.breadcrumbs {
  margin-bottom: 5px;
  height: 20px;

  .breadcrumb {
    &::after {
      content: " / ";
      margin: 0 5px;
    }
  }
}

.title {
  font-weight: normal;
  margin-top: 5px;
  margin-bottom: 40px;
}

</style>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
  setup() {
    const store = useStore();
    return toRefs(store.state);
  },
});
</script>
