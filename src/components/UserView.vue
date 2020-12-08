<template>
  <div v-if="data.user.username">
    <h1>
      {{ data.user.username }}
      <i
        v-if="accounts.username && accounts.username !== data.user.username"
        class="button"
        :class="accounts.friends.indexOf(data.user.username) > -1 ? 'el-icon-star-on' : 'el-icon-star-off'"
        @click="handleToggleFriend"/>
    </h1>
    <span v-if="data.user.admin">{{ translate(i18n.lang, 'admin') }}</span>
    <p>Email: {{ data.user.email }}</p>
    <p>Desc: {{ data.user.desc }}</p>
    <div v-if="accounts.username === data.user.username || accounts.admin">
      <h2>{{ translate(i18n.lang, 'my_files') }}</h2>
      <el-button
        v-if="accounts.username === data.user.username"
        type="primary"
        size="small"
        @click="handleUpload">
        {{ translate(i18n.lang, 'upload') }}
      </el-button>
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
    </div>
    <div v-if="accounts.username === data.user.username">
      <h2>{{ translate(i18n.lang, 'my_accounts') }}</h2>
      <el-button
        type="danger"
        @click="handleLogout">
        {{ translate(i18n.lang, 'logout') }}
      </el-button>
    </div>
  </div>
  <div v-else>
    <h1>{{ translate(i18n.lang, 'user_not_exists') }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, watch } from 'vue';
import { chooseFile, handleNetworkRequestError, toSizeString, msgbox, notify } from '@/utils';
import { useStore } from 'vuex';
import { MutationTypes, StoreState } from '@/store';
import { translate } from '@/i18n/translate';
import { API } from '@/api';
import { FileDetail } from 'app/types';

export default defineComponent({
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  async setup(props) {
    const { username } = toRefs(props);
    const store = useStore<StoreState>();

    const loadUser = async () => {
      const result = await API.getUserDetail(username.value);
      if (result.status === 200) {
        store.commit(MutationTypes.FETCH_USER_DETAIL, result.user);
        store.commit(MutationTypes.CHANGE_SSR_TITLE, `${translate(store.state.i18n.lang, 'user')}: ${result.user.username} - AIOJ`);
      } else {
        handleNetworkRequestError(store, result);
        return;
      }

      if (store.state.accounts.username !== username.value && !store.state.accounts.admin) {
        return;
      }

      const fileres = await API.getUserUploadedFiles(username.value);
      if (fileres.status === 200) {
        store.commit(MutationTypes.FETCH_FILE_LIST, fileres.files);
      } else {
        handleNetworkRequestError(store, result);
      }
    };
    watch(username, loadUser);
    await loadUser();

    const handleRemoveFriend = async () => {
      const result = await API.removeFriend(username.value);
      if (result.status === 200) {
        store.commit(MutationTypes.REMOVE_FRIEND, username.value);
      } else {
        handleNetworkRequestError(store, result);
      }
    };
    const handleAddFriend = async () => {
      const result = await API.addFriend(username.value);
      if (result.status === 200) {
        store.commit(MutationTypes.ADD_NEW_FRIEND, username.value);
      } else {
        handleNetworkRequestError(store, result);
      }
    };

    const handleToggleFriend = async () => {
      if (store.state.accounts.friends.indexOf(username.value) > -1) {
        await handleRemoveFriend();
      } else {
        await handleAddFriend();
      }
    };

    const handleUpload = async () => {
      const file = await chooseFile();
      if (!file) return;
      const result = await API.uploadFile(file);
      if (result.status === 200) {
        store.commit(MutationTypes.CREATED_FILE, result.file);
      } else {
        handleNetworkRequestError(store, result);
      }
    };

    const handleDeleteFile = async (file: FileDetail) => {
      try {
        await msgbox.confirm(
          translate(store.state.i18n.lang, 'confirm_delete', file.filename),
          translate(store.state.i18n.lang, 'warning'),
          {
            type: 'warning',
            confirmButtonText: translate(store.state.i18n.lang, 'ok'),
            cancelButtonText: translate(store.state.i18n.lang, 'cancel'),
          },
        );
      } catch (e) {
        return;
      }

      const result = await API.deleteFile(file.fid);
      if (result.status === 200) {
        store.commit(MutationTypes.DELETED_FILE, file.fid);
        notify({
          title: translate(store.state.i18n.lang, 'success'),
          type: 'success',
          message: translate(store.state.i18n.lang, 'delete_success'),
        });
      } else {
        handleNetworkRequestError(store, result);
      }
    };

    const handleLogout = async () => {
      const result = await API.logoutAttempt();
      if (result.status === 200) {
        store.commit(MutationTypes.LOGOUT);
      } else {
        handleNetworkRequestError(store, result);
      }
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

.el-icon-star-on {
  color: #ffd200;
}

.button {
  cursor: pointer;
}

.file-list {

  .file-item {
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    grid-column-gap: 20px;
  }
}

</style>
