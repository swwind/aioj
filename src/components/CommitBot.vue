<template>
  <ui-header />
  <ui-sidebar>
    <template #sidebar>
      <ui-card nopadding>
        <template #header>
          <ui-text text="operations"/>
        </template>
        <ui-listed-button icon="location-arrow" v-if="accounts.username" :to="`/submit/${data.problem.pid}`">
          <ui-text text="submit"/>
        </ui-listed-button>
        <ui-listed-button icon="history">
          <ui-text text="submissions"/>
        </ui-listed-button>
        <ui-listed-button icon="comments" :to="`/r/p${data.problem.pid}`">
          <ui-text text="discuss"/>
        </ui-listed-button>
        <ui-listed-hr v-if="hasPermission" />
        <ui-listed-button icon="edit" v-if="hasPermission" :active="editing" @click="handleEdit">
          <ui-text text="edit"/>
        </ui-listed-button>
        <ui-listed-button icon="trash-alt" danger v-if="hasPermission" @click="handleDeleteProblem">
          <ui-text text="delete"/>
        </ui-listed-button>
      </ui-card>
    </template>
    <ui-card>
      <template #header>
        Submit for Problem {{ pid }}
      </template>
      <ui-input v-model="name" placeholder="bot_name" icon="robot"></ui-input>
      <div class="margin">
        <ui-text text="Enter your code below or use a zip file..."></ui-text>
      </div>
      <ui-fileinput class="margin" accept=".zip" />
      <ui-code v-model="code" class="margin" />
    </ui-card>
  </ui-sidebar>
</template>

<style lang="less" scoped>

</style>

<script lang="ts">
import { MyStore } from '@/store';
import { MutationTypes } from '@/store/mutation-types';
import { computed, defineComponent, ref, toRefs } from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
  props: {
    pid: Number,
  },
  setup() {
    const store = useStore() as MyStore;
    store.commit(MutationTypes.CHANGE_SSR_TITLE, 'Create Bot');

    const code = ref({});
    const name = ref('');

    const hasPermission = computed(() => store.state.accounts.username === store.state.data.problem.author || store.state.accounts.admin);

    return {
      name,
      code,
      hasPermission,
      ...toRefs(store.state),
    };
  },
});
</script>
