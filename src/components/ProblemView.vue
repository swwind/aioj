<template>
  <ui-header :title="data.problem.title">
    <template #route1>
      <ui-text text="problems" to="/p" />
    </template>
    <ui-text :text="data.problem.title" raw />
  </ui-header>

  <ui-sidebar v-if="ssr.status === 200">
    <template #sidebar>
      <ui-card nopadding>
        <template #header>
          <ui-text text="operations"/>
        </template>
        <ui-listed-button icon="location-arrow" v-if="accounts.username" :active="submit" @click="handleSubmit">
          <ui-text text="submit"/>
        </ui-listed-button>
        <ui-listed-button icon="history" v-if="accounts.username" :to="`/b/list?p=${data.problem.pid}&u=${accounts.username}`">
          <ui-text text="my_bots"/>
        </ui-listed-button>
        <ui-listed-button icon="robot" :to="`/b/list?p=${data.problem.pid}`">
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

    <!-- problem showing page -->
    <ui-card notitle v-if="!editing && !submit">
      <ui-text icon="robot" :text="playerNumbers" raw />
      <ui-text icon="user" :text="data.problem.author" raw :to="`/u/${data.problem.author}`" />
      <ui-content class="margin" :text="data.problem.content" markdown />
    </ui-card>

    <!-- submit page -->
    <ui-card v-if="submit">
      <template #header>
        <ui-text text="create_a_new_bot" />
      </template>
      <div class="margin">
        <ui-text text="give_your_bot_a_name" />
      </div>
      <ui-input v-model="name" placeholder="bot_name" icon="robot" class="margin" required />
      <ui-editor v-model="description" class="margin" placeholder="bot_description" />
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

    <!-- editing page -->
    <ui-card notitle v-if="editing">
      <h3>Title</h3>
      <ui-input type="text" v-model="title" icon="align-left" placeholder="problem_title" />
      <h3>Description</h3>
      <ui-editor class="margin" v-model="content" placeholder="problem_description"></ui-editor>
      <h3>Paint Script</h3>
      <ui-code class="margin" v-model="paint" locked />
      <h3>Players</h3>
      <div class="range">
        <ui-input type="number" v-model="playerMin" class="item" required placeholder="min_value" />
        <span class="hr"></span>
        <ui-input type="number" v-model="playerMax" class="item" required placeholder="max_value" />
      </div>
      <div class="margin" v-if="data.problem.fid">Now judger: <a :href="`${cdn}/f/${data.problem.fid}`">{{ data.problem.fid }}</a></div>
      <div class="margin" v-else>No data available.</div>
      <div>
        <ui-fileinput class="margin" accept=".zip" v-model="file" />
        <ui-button icon="upload" type="primary" text @click="handleUploadProblemJudger">
          <ui-text text="upload" />
        </ui-button>
      </div>
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

.range {
  display: flex;

  .hr {
    width: 20px;
  }

  .item {
    flex: 1;
  }
}

</style>

<script lang="ts">
import { MyStore } from '../store';
import { ActionTypes } from '../store/action-types';
import { confirm } from '../utils';
import { computed, defineComponent, ref, toRefs, watch } from 'vue';
import { useStore } from 'vuex';
import config from '../../config.json';

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
    const paint = ref({ lang: 'js', code: '' });
    const playerMin = ref(0);
    const playerMax = ref(0);

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
    };

    const handleSubmitByFile = () => {
      if (file.value === null) return;

      store.dispatch(ActionTypes.CREATE_BOT_BY_FILE, {
        pid,
        name,
        description,
        file: file.value,
      });
    };

    const handleEdit = () => {
      content.value = store.state.data.problem.content;
      title.value = store.state.data.problem.title;
      paint.value.code = store.state.data.problem.paint;
      playerMin.value = store.state.data.problem.playerMin;
      playerMax.value = store.state.data.problem.playerMax;
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
        playerMin,
        playerMax,
        paint: paint.value.code,
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

    const handleUploadProblemJudger = async () => {
      if (!file.value) return;
      await store.dispatch(ActionTypes.UPLOAD_PROBLEM_JUDGER, { pid, file: file.value });
    };

    const hasPermission = computed(() => store.state.accounts.username === store.state.data.problem.author || store.state.accounts.admin);

    const playerNumbers = computed(() =>
      store.state.data.problem.playerMin === store.state.data.problem.playerMax
        ? String(store.state.data.problem.playerMin)
        : store.state.data.problem.playerMax === Infinity
          ? `> ${store.state.data.problem.playerMin}`
          : `${store.state.data.problem.playerMin} ~ ${store.state.data.problem.playerMax}`);

    return {
      editing,
      content,
      title,
      playerNumbers,
      playerMin,
      playerMax,
      submit,
      name,
      code,
      file,
      paint,
      handleEdit,
      description,
      handleSubmitByCode,
      handleSubmitByFile,
      hasPermission,
      handleExitEdit,
      handleUpdateProblem,
      handleSubmit,
      handleDeleteProblem,
      handleUploadProblemJudger,
      cdn: config.port === 443 ? '//' + config.cdn : '',
      ...toRefs(store.state),
    };
  },
});
</script>
