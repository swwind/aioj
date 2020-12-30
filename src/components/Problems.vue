<template>
  <ui-header />
  <ui-card notitle>
    <ui-icon
      v-if="!data.problems.length"
      name="cat"
      text="no_problems"
    />
    <div class="item" v-for="problem of data.problems" :key="problem.pid" v-else>
      <router-link :to="`/p/${problem.pid}`" class="title">{{ problem.title }}</router-link>
    </div>
  </ui-card>
  <ui-card v-if="accounts.admin">
    <template #header>
      <ui-text text="create_new_problem"/>
    </template>
    <ui-input
      type="text"
      icon="align-left"
      v-model="title"
      placeholder="problem_title" />
    <div class="buttonset">
      <ui-button
        type="primary"
        icon="location-arrow"
        @click="handleCreateProblem">
        <ui-text text="create"/>
      </ui-button>
    </div>
  </ui-card>
</template>

<style lang="less" scoped>
.buttonset {
  margin-top: 20px;
}
</style>

<script lang="ts">
import { translate } from '@/i18n/translate';
import { MyStore } from '@/store';
import { ActionTypes } from '@/store/action-types';
import { MutationTypes } from '@/store/mutation-types';
import { defineComponent, ref, toRefs } from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
  async setup() {
    const store = useStore() as MyStore;
    const title = ref('');

    store.commit(MutationTypes.CHANGE_SSR_TITLE, translate(store.state.i18n.lang, 'problems'));
    await store.dispatch(ActionTypes.FETCH_PROBLEMS_DATA);

    const handleCreateProblem = async () => {
      await store.dispatch(ActionTypes.CREATE_PROBLEM, { title });
    }

    return {
      title,
      handleCreateProblem,
      ...toRefs(store.state),
    };
  },
});
</script>
