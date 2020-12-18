<template>
  <div v-if="data.user.username" class="userview">
    <el-card shadow="hover">
      <template #header>
        <h1>
          {{ data.user.username }}
          <i
            v-if="accounts.username && accounts.username !== data.user.username"
            class="button"
            :class="accounts.friends.indexOf(data.user.username) > -1 ? 'el-icon-star-on' : 'el-icon-star-off'"
            @click="handleToggleFriend"/>
        </h1>
      </template>
      <span v-if="data.user.admin">{{ translate(i18n.lang, 'admin') }}</span>
      <p>Email: {{ data.user.email }}</p>
      <p>Desc: {{ data.user.desc }}</p>
    </el-card>
    <el-card shadow="hover" v-if="accounts.username === data.user.username || accounts.admin" class="files">
      <template #header>
        <h2>{{ translate(i18n.lang, 'my_files') }}</h2>
      </template>
      <el-button
        v-if="accounts.username === data.user.username"
        type="primary"
        size="small"
        :disabled="data.uploading"
        @click="handleUpload">
        {{ translate(i18n.lang, 'upload') }}
      </el-button>
      <el-progress
        class="progress"
        v-if="data.uploading"
        :text-inside="true"
        :stroke-width="16"
        :percentage="Math.round(data.progress * 100)" />
      <div
        v-if="accounts.username === data.user.username"
        class="el-upload__tip">
        {{ translate(i18n.lang, 'upload_tips') }}
      </div>
      <div class="file-list">
        <div class="file-item" v-for="file in data.files" :key="file.fid">
          <span class="file-name">
            <a :href="`/f/${file.fid}`" target="_blank">{{ file.filename }}</a>
          </span>
          <span class="file-size">
            {{ toSizeString(file.size) }}
          </span>
          <span class="file-date">
            <i class="el-icon-date"></i>
            {{ new Date(file.date).toLocaleString() }}
          </span>
          <span class="file-operations">
            <i class="button el-icon-delete" @click="handleDeleteFile(file)"></i>
          </span>
        </div>
      </div>
    </el-card>
    <el-card shadow="hover" v-if="accounts.username === data.user.username" class="actions">
      <template #header>
        <h2>{{ translate(i18n.lang, 'my_accounts') }}</h2>
      </template>
      <el-button
        type="danger"
        size="small"
        @click="handleLogout">
        {{ translate(i18n.lang, 'logout') }}
      </el-button>
    </el-card>
  </div>
  <div v-else>
    <el-card shadow="hover">
      <template #header>
        <h1>{{ translate(i18n.lang, 'user_not_exists') }}</h1>
      </template>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, watch } from 'vue';
import { toSizeString, preventSSRFetchTwice, confirm } from '@/utils';
import { useStore } from 'vuex';
import { translate } from '@/i18n/translate';
import { FileDetail } from 'app/types';
import { MyStore } from '@/store';
import { ActionTypes } from '@/store/action-types';

export default defineComponent({
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  async setup(props) {
    const { username } = toRefs(props);
    const store = useStore() as MyStore;

    const handleToggleFriend = async () => {
      if (store.state.accounts.friends.indexOf(username.value) > -1) {
        await store.dispatch(ActionTypes.REMOVE_FRIEND, username.value);
      } else {
        await store.dispatch(ActionTypes.ADD_FRIEND, username.value);
      }
    };

    const handleUpload = async () => {
      await store.dispatch(ActionTypes.UPLOAD_FILE);
    };

    const handleDeleteFile = async (file: FileDetail) => {
      if (!await confirm(store.state.i18n.lang, translate(store.state.i18n.lang, 'confirm_delete', file.filename))) {
        return;
      }

      await store.dispatch(ActionTypes.DELETE_FILE, file);
    };

    const handleLogout = async () => {
      if (!await confirm(store.state.i18n.lang, translate(store.state.i18n.lang, 'confirm_logout'))) {
        return;
      }

      await store.dispatch(ActionTypes.LOGOUT);
    };

    const loadUser = async () => {
      await store.dispatch(ActionTypes.FETCH_USER_DATA, username.value);
      if (store.state.accounts.username === username.value || store.state.accounts.admin) {
        await store.dispatch(ActionTypes.FETCH_USER_FILES, username.value);
      }
    };
    watch(username, loadUser);
    if (preventSSRFetchTwice()) {
      await loadUser();
    }

    return {
      translate,
      handleToggleFriend,
      ...toRefs(store.state),
      toSizeString,
      handleUpload,
      handleDeleteFile,
      handleLogout,
    };
  },
});

</script>

<style lang="less">
.userview {
  .el-card__body {
    margin: 20px 0;
  }
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

.el-icon-star-on {
  color: #ffd200;
}

.button {
  cursor: pointer;
}

.files, .actions {
  margin-top: 20px;
}

.progress {
  margin-left: 20px;
  display: inline-block;
  width: 200px;
}

.file-list {

  .file-item {
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    grid-column-gap: 20px;

    .file-name {
      word-break: break-word;
    }
  }
}

</style>
