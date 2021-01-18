<template>
  <ui-header />
  <ui-sidebar v-if="ssr.status === 200">
    <template #sidebar>
      <ui-card nopadding>
        <template #header>
          <ui-text text="operations"/>
        </template>
        <ui-listed-button icon="location-arrow" v-if="accounts.username" :active="submit" @click="handleSubmit">
          <ui-text text="submit"/>
        </ui-listed-button>
        <ui-listed-button icon="history" v-if="accounts.username" :to="`/bot/list?p=${data.problem.pid}&user=${accounts.username}`">
          <ui-text text="my_bots"/>
        </ui-listed-button>
        <ui-listed-button icon="robot" :to="`/bot/list?p=${data.problem.pid}`">
          <ui-text text="all_bots"/>
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
    <ui-card notitle v-if="!editing && !submit">
      <ui-content :text="data.problem.content" markdown />
    </ui-card>
    <ui-card v-if="submit">
      <template #header>
        <ui-text text="create_a_new_bot" />
      </template>
      <div class="margin">
        <ui-text text="give_your_bot_a_name" />
      </div>
      <ui-input v-model="name" placeholder="bot_name" icon="robot" class="margin" required />
      <ui-editor v-model="description" class="margin" placeholder="Fooosss" />
      <div class="margin">
        <ui-text text="submit_your_code_or_upload_a_zip" />
      </div>
      <ui-fileinput class="margin" accept=".zip" v-model="file" />
      <ui-button icon="location-arrow" type="primary" text v-if="file" @click="handleSubmitByFile">
        <ui-text text="submit_file" />
      </ui-button>
      <ui-code v-model="code" class="margin" />
      <ui-button icon="location-arrow" type="primary" class="margin" @click="handleSubmitByCode">
        <ui-text text="submit_code" />
      </ui-button>
    </ui-card>
    <ui-card notitle v-if="editing">
      <ui-input type="text" v-model="title" icon="align-left" placeholder="problem_title" />
      <ui-editor class="margin" v-model="content"></ui-editor>
      <div class="margin">
        <ui-button icon="location-arrow" type="primary" @click="handleUpdateProblem">
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
import { confirm } from '@/utils';
import { computed, defineComponent, ref, toRefs, watch } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  props: {
    pid: {
      type: Number,
      required: true,
    },
  },
  async setup(props) {
    const { pid } = toRefs(props);
    const store = useStore() as MyStore;
    const editing = ref(false);
    const submit = ref(false);
    const name = ref('');
    const description = ref('');
    const code = ref({ lang: 'cpp', code: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  return 0;\n}' });
    const file = ref<File | null>(null);
    const content = ref('');
    const title = ref('');

    const updateFetch = async () => {
      await store.dispatch(ActionTypes.FETCH_PROBLEM_DATA, pid);
    };
    watch(pid, updateFetch);
    await updateFetch();

    const handleSubmitByCode = () => {
      store.dispatch(ActionTypes.CREATE_BOT_BY_CODE, {
        pid,
        name,
        description,
        src: code.value.code,
        type: code.value.lang,
      });
    }

    const handleSubmitByFile = () => {
      if (file.value === null) return;

      store.dispatch(ActionTypes.CREATE_BOT_BY_FILE, {
        pid,
        name,
        description,
        file: file.value,
      });
    }

    const handleEdit = () => {
      content.value = store.state.data.problem.content;
      title.value = store.state.data.problem.title;
      editing.value = true;
      submit.value = false;
    };

    const handleExitEdit = () => {
      editing.value = false;
    };

    const handleSubmit = () => {
      submit.value = true;
      editing.value = false;
    };

    const handleUpdateProblem = async () => {
      const success = await store.dispatch(ActionTypes.UPDATE_PROBLEM, {
        pid,
        title,
        content,
        hidden: false,
      });
      if (success) {
        handleExitEdit();
      }
    };

    const handleDeleteProblem = async () => {
      if (!await confirm(store.state.i18n.lang, 'confirm_delete', store.state.data.problem.title)) {
        return;
      }
      await store.dispatch(ActionTypes.DELETE_PROBLEM, pid);
    };

    const hasPermission = computed(() => store.state.accounts.username === store.state.data.problem.author || store.state.accounts.admin);

    return {
      editing,
      content,
      title,
      submit,
      name,
      code,
      file,
      handleEdit,
      description,
      handleSubmitByCode,
      handleSubmitByFile,
      hasPermission,
      handleExitEdit,
      handleUpdateProblem,
      handleSubmit,
      handleDeleteProblem,
      ...toRefs(store.state),
    };
  },
});
</script>
