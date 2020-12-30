<template>
  <ui-header />
  <ui-sidebar>
    <template #sidebar>
      <ui-card nopadding>
        <template #header>
          <ui-text text="operations"/>
        </template>
        <ui-listed-button icon="location-arrow" v-if="accounts.username">
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
        <ui-listed-button icon="trash-alt" danger v-if="hasPermission">
          <ui-text text="delete"/>
        </ui-listed-button>
      </ui-card>
    </template>
    <ui-card notitle v-if="!editing">
      <ui-content :text="data.problem.content" markdown></ui-content>
    </ui-card>
    <ui-card notitle v-else>
      <ui-editor v-model="content"></ui-editor>
      <div class="margin">
        <ui-button icon="location-arrow" type="primary">
          <ui-text text="submit"/>
        </ui-button>
        <ui-button icon="cat" @click="handleExitEdit">
          <ui-text text="cancel"/>
        </ui-button>
      </div>
    </ui-card>
  </ui-sidebar>
</template>

<style lang="less" scoped>

.margin {
  margin-top: 20px;
}

</style>

<script lang="ts">
import { MyStore } from '@/store';
import { ActionTypes } from '@/store/action-types';
import { computed, defineComponent, ref, toRefs, watch } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  props: {
    pid: {
      type: String,
      required: true,
    },
  },
  async setup(props) {
    const { pid } = toRefs(props);
    const store = useStore() as MyStore;
    const editing = ref(false);
    const content = ref('');

    const updateFetch = async () => {
      await store.dispatch(ActionTypes.FETCH_PROBLEM_DATA, pid.value);
    };
    watch(pid, updateFetch);
    await updateFetch();

    const handleEdit = () => {
      content.value = store.state.data.problem.content;
      editing.value = true;
    };

    const handleExitEdit = () => {
      editing.value = false;
    };

    const hasPermission = computed(() => store.state.accounts.username === store.state.data.problem.author || store.state.accounts.admin);

    return {
      editing,
      content,
      handleEdit,
      handleExitEdit,
      hasPermission,
      ...toRefs(store.state),
    };
  },
});
</script>
