<template>
  <ui-header :title="data.user.username">
    <template #route1>
      <ui-text text="user" />
    </template>
    <ui-text :text="data.user.username" raw />
  </ui-header>

  <div v-if="data.user.username" class="userview">
    <ui-card>
      <template #header>
        {{ data.user.username }}
        <ui-icon
          v-if="accounts.username && accounts.username !== data.user.username"
          class="star"
          name="star"
          :regular="!isFriend"
          :class="{ on: isFriend }"
          @click="handleToggleFriend"/>
      </template>
      <span v-if="data.user.admin">
        <ui-text text="admin"/>
      </span>
      <p>Email: {{ data.user.email }}</p>
      <p>Desc: {{ data.user.description }}</p>
    </ui-card>
    <ui-card v-if="accounts.username === data.user.username || accounts.admin" class="files">
      <template #header>
        <ui-text text="my_files"/>
      </template>
      <ui-button
        v-if="accounts.username === data.user.username"
        type="primary"
        small
        :disabled="data.uploading"
        @click="handleUpload">
        <ui-text text="upload"/>
      </ui-button>
      <span
        v-if="data.uploading"
        class="progress">
        {{ (data.progress * 100).toFixed(2) + '%' }}
      </span>
      <div
        v-if="accounts.username === data.user.username"
        class="tips">
        <ui-text text="upload_tips"/>
      </div>
      <ui-icon
        v-if="!data.files.length"
        name="cat"
        text="no_files"
      />
      <div class="file-list" v-else>
        <div class="file-item" v-for="file in data.files" :key="file.fid">
          <span class="file-name">
            <a :href="`${cdn}/f/${file.fid}`" target="_blank">{{ file.filename }}</a>
          </span>
          <span class="file-size">
            {{ toSizeString(file.size) }}
          </span>
          <ui-date :time="file.date" />
          <span class="file-operations">
            <ui-icon class="icon" name="trash-alt" regular @click="handleDeleteFile(file)" right />
            <ui-icon class="icon" name="code" @click="handleCopyLink(file)" />
          </span>
        </div>
      </div>
    </ui-card>
    <ui-card v-if="accounts.username === data.user.username" class="actions">
      <template #header>
        <ui-text text="my_accounts"/>
      </template>
      <ui-button
        type="danger"
        small
        @click="handleLogout">
        <ui-text text="logout"/>
      </ui-button>
    </ui-card>
  </div>
  <div v-else>
    <ui-card>
      <template #header>
        <ui-text text="user_not_exists"/>
      </template>
    </ui-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, watch } from 'vue';
import { toSizeString, confirm, copyToClipboard } from '../utils';
import { useStore } from 'vuex';
import { FileDetail } from 'app/types';
import { MyStore } from '../store';
import { ActionTypes } from '../store/action-types';
import config from '../../config.json';

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
      if (!await confirm(store.state.i18n.lang, 'confirm_delete', file.filename)) {
        return;
      }

      await store.dispatch(ActionTypes.DELETE_FILE, file);
    };

    const getLink = (file: FileDetail) => {
      if (/\.(?:mp4|webm)$/i.test(file.filename)) {
        return `![](aioj://video/${file.fid})`;
      } else if (/\.(?:flv)$/i.test(file.filename)) {
        return `![](aioj://flv/${file.fid})`;
      } else if (/\.(?:mp3|wav|ogg)$/i.test(file.filename)) {
        return `![](aioj://audio/${file.fid})`;
      } else if (/\.(?:jpe?g|png|gif|webp)$/i.test(file.filename)) {
        return `![](aioj://image/${file.fid})`;
      }
      return `![${file.filename}](aioj://fs/${file.fid})`;
    };

    const handleCopyLink = async (file: FileDetail) => {
      const link = getLink(file);
      const success = await copyToClipboard(link);
      if (success) {
        store.dispatch(ActionTypes.NOTIFY_COPY_SUCCESS);
      } else {
        store.dispatch(ActionTypes.NOTIFY_COPY_FAILED);
      }
    };

    const handleLogout = async () => {
      if (!await confirm(store.state.i18n.lang, 'confirm_logout')) {
        return;
      }

      await store.dispatch(ActionTypes.LOGOUT);
    };

    const loadUser = async () => {
      await store.dispatch(ActionTypes.FETCH_USER_DATA, props.username);
      if (store.state.accounts.username === props.username || store.state.accounts.admin) {
        await store.dispatch(ActionTypes.FETCH_USER_FILES, props.username);
      }
    };
    watch(username, loadUser);
    await loadUser();

    const isFriend = computed(() => store.state.accounts.friends.indexOf(username.value) > -1);

    return {
      isFriend,
      toSizeString,
      handleUpload,
      handleLogout,
      handleCopyLink,
      handleDeleteFile,
      handleToggleFriend,
      ...toRefs(store.state),
      cdn: config.env === 'production' ? '//' + config.cdn : '',
    };
  },
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

@import "../plugins/ui/styles/vars.less";

.star {
  cursor: pointer;
  vertical-align: middle !important;

  &.on {
    color: @yellow;
  }
}

.files, .actions {
  margin-top: 20px;
}

.progress {
  margin-left: 20px;
  display: inline-block;
  width: 200px;
}

.tips {
  color: @font-color-light;
  font-size: .9rem;
  margin: 5px 0;
}

.file-list {

  .file-item {
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    grid-column-gap: 20px;

    .file-name {
      word-break: break-word;
    }

    .file-operations {
      cursor: pointer;

      .icon {
        width: 20px;
      }
    }
  }
}

</style>
