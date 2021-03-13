<template>
  <p class="breadcrumbs" v-if="ssr.status === 200">
    <span class="breadcrumb" v-for="i in [1, 2, 3, 4, 5]" :key="i">
      <slot :name="`route${i}`"></slot>
    </span>
  </p>
  <h1 class="title">
    <slot v-if="ssr.status === 200"></slot>
    <ui-text v-else text="not_found" />
  </h1>
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

    &:empty {
      display: none;
    }
  }
}

.title {
  font-weight: normal;
  margin-top: 5px;
  margin-bottom: 40px;
  transform: translateY(10px);
  opacity: 0;

  animation-name: fadein;
  animation-fill-mode: forwards;
  animation-duration: .5s;
}

@keyframes fadein {
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

</style>

<script lang="ts">
import { translate } from '../../i18n/translate';
import { MyStore } from '../../store';
import { MutationTypes } from '../../store/mutation-types';
import { defineComponent, toRefs } from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
  props: {
    title: String,
    translate: Boolean,
  },
  setup(props) {
    const store = useStore() as MyStore;
    if (store.state.ssr.status === 200 && props.title) {
      store.commit(MutationTypes.CHANGE_SSR_TITLE, props.translate
        ? translate(store.state.i18n.lang, props.title)
        : props.title);
    } else {
      store.commit(MutationTypes.CHANGE_SSR_TITLE, translate(store.state.i18n.lang, 'not_found'));
    }
    return {
      ...toRefs(store.state),
    };
  },
});
</script>
