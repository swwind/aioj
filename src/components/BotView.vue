<template>
  <ui-header :title="data.bot.name">
    <template #route1>
      <ui-text text="bot" />
    </template>
    <ui-text :text="data.bot.name" row />
  </ui-header>

  <ui-sidebar v-if="ssr.status === 200">
    <template #sidebar>
      <ui-card nopadding>
        <template #header>
          <ui-text text="operations" />
        </template>
        <ui-listed-button icon="download" :href="`${cdn}/f/${data.bot.fid}`">
          <ui-text text="download" />
        </ui-listed-button>
        <ui-listed-button icon="bomb">
          <ui-text text="start_round" />
        </ui-listed-button>
        <ui-listed-button icon="anchor" :to="`/p/${data.bot.pid}`">
          <ui-text text="goto_problem" />
        </ui-listed-button>
        <ui-listed-hr v-if="isMybot || isAdmin" />
        <ui-listed-button icon="edit" @click="handleEdit" :active="editing">
          <ui-text text="edit" />
        </ui-listed-button>
      </ui-card>
    </template>

    <!-- viewing page -->
    <ui-card notitle v-if="!editing">
      <ui-text :text="`${data.bot.version}`" row icon="code-branch" />
      <ui-text :text="data.bot.author" row icon="user" :to="`/u/${data.bot.author}`" />
      <ui-date :time="data.bot.created" />
      <ui-date :time="data.bot.updated" />
      <ui-content :text="data.bot.description" markdown class="margin"></ui-content>
    </ui-card>

    <!-- editing page -->
    <ui-card notitle v-if="editing">
      <h3>
        <ui-text text="bot_name" />
      </h3>
      <ui-input v-model="name" placeholder="bot_name" icon="robot" class="margin" required />
      <ui-editor v-model="description" class="margin" placeholder="bot_description" />
      <div class="margin" v-if="!updatesource">
        <ui-button icon="location-arrow" type="primary" @click="handleUpdateInfomationsOnly">
          <ui-text text="submit" />
        </ui-button>
        <ui-button type="primary" text @click="handleEditSource">
          <ui-text text="update_code" />
        </ui-button>
      </div>
      <div v-else>
        <div class="margin">
          <ui-text text="submit_your_code_or_upload_a_zip" />
        </div>
        <ui-fileinput class="margin" accept=".zip" v-model="file" />
        <div class="margin" v-if="file">
          <ui-button icon="location-arrow" type="primary" @click="handleUpdateByFile">
            <ui-text text="submit_file" />
          </ui-button>
        </div>
        <ui-code v-model="code" class="margin" v-if="!file" />
        <ui-button icon="location-arrow" type="primary" v-if="!file" class="margin" @click="handleUpdateByCode">
          <ui-text text="submit_code" />
        </ui-button>
      </div>
    </ui-card>

    <!-- score page -->
    <ui-card>
      <template #header>
        <ui-text text="bot_score" />
      </template>
      TODO
    </ui-card>
  </ui-sidebar>
</template>

<style lang="less" scoped>

</style>

<script lang="ts">
import { MyStore } from '../store';
import { ActionTypes } from '../store/action-types';
import { computed, defineComponent, ref, toRefs, watch } from 'vue';
import { useStore } from 'vuex';
import config from '../../config.json';

export default defineComponent({
  props: {
    bid: {
      type: Number,
      required: true,
    },
  },
  async setup(props) {
    const { bid } = toRefs(props);
    const store = useStore() as MyStore;

    const preload = async () => {
      await store.dispatch(ActionTypes.FETCH_BOT_DATA, bid);
    };
    watch(bid, preload);
    await preload();

    const isMybot = computed(() => store.state.data.bot.author === store.state.accounts.username);
    const isAdmin = computed(() => store.state.accounts.admin);

    const editing = ref(false);
    const updatesource = ref(false);
    const name = ref('');
    const description = ref('');
    const file = ref<File | null>(null);
    const code = ref({ lang: 'cpp', code: '' });

    const handleEdit = () => {
      name.value = store.state.data.bot.name;
      description.value = store.state.data.bot.description;
      updatesource.value = false;
      editing.value = true;
    };
    const handleEditSource = () => {
      updatesource.value = true;
    };

    const handleUpdateInfomationsOnly = async () => {
      const success = await store.dispatch(ActionTypes.UPDATE_BOT_ONLY, {
        bid, name, description,
      });
      if (success) {
        editing.value = false;
      }
    };
    const handleUpdateByCode = async () => {
      const success = await store.dispatch(ActionTypes.UPDATE_BOT_BY_CODE, {
        bid,
        name,
        description,
        src: code.value.code,
        type: code.value.lang,
      });
      if (success) {
        editing.value = false;
      }
    };
    const handleUpdateByFile = async () => {
      if (!file.value) return;
      const success = await store.dispatch(ActionTypes.UPDATE_BOT_BY_FILE, {
        bid,
        name,
        description,
        file: file.value,
      });
      if (success) {
        editing.value = false;
      }
    };

    return {
      isMybot,
      isAdmin,
      editing,
      updatesource,
      handleEdit,
      name,
      description,
      file,
      code,
      handleUpdateByCode,
      handleEditSource,
      handleUpdateByFile,
      handleUpdateInfomationsOnly,
      ...toRefs(store.state),
      cdn: config.port === 443 ? '//' + config.cdn : '',
    };
  },
});
</script>
