<template>
  <h1>{{ data.region.title }}</h1>
  <p>{{ data.region.description }}</p>
  <div class="operations" v-if="accounts.admin">
    <i class="el-icon-delete" @click="handleDeleteRegion"></i>
    <i class="el-icon-edit"></i>
  </div>
  <div class="posts-list">
    <el-alert type="warning" v-if="!data.posts.length">{{ translate(i18n.lang, 'no_posts') }}</el-alert>
    <div class="post-item" v-for="post of data.posts" :key="post.pid">
      <div class="title">
        <router-link :to="`/r/${data.region.region}/${post.pid}`">{{ post.title }}</router-link>
      </div>
      <router-link class="author" :to="`/u/${post.author}`">
        <i class="el-icon-user-solid"></i>
        {{ post.author }}
      </router-link>
      <time class="time">
        <i class="el-icon-date"></i>
        {{ new Date(post.date).toLocaleString() }}
      </time>
    </div>
  </div>
  <div class="create" v-if="accounts.username">
    <h2>{{ translate(i18n.lang, 'create_new_post') }}</h2>
    <el-input
      type="text"
      v-model="title"
      class="title"
      :placeholder="translate(i18n.lang, 'post_title')" />
    <el-input
      type="textarea"
      v-model="content"
      class="content"
      :placeholder="translate(i18n.lang, 'post_content')" />
    <div class="buttonset">
      <el-button
        type="primary"
        @click="handleSendPost">
        {{ translate(i18n.lang, 'post') }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue';
import { handleNetworkRequestError, msgbox, notify, preventSSRFetchTwice } from '@/utils';
import { useStore } from 'vuex';
import { ActionTypes, MutationTypes, StoreState } from '@/store';
import { translate } from '@/i18n/translate';
import { useRouter } from 'vue-router';
import { API } from '@/api';

export default defineComponent({
  props: {
    region: {
      type: String,
      required: true,
    },
  },
  async setup(props) {
    const { region } = toRefs(props);
    const store = useStore<StoreState>();
    const router = useRouter();

    const title = ref('');
    const content = ref('');
    const handleSendPost = async () => {
      const result = await API.createPost(region.value, title.value, content.value);
      if (result.status === 200) {
        router.push(`/r/${region.value}/${result.pid}`);
      } else {
        handleNetworkRequestError(store, result);
      }
    };

    const handleDeleteRegion = async () => {
      try {
        await msgbox.confirm(
          translate(store.state.i18n.lang, 'confirm_delete_region'),
          translate(store.state.i18n.lang, 'warning'),
          {
            type: 'warning',
            confirmButtonText: translate(store.state.i18n.lang, 'ok'),
            cancelButtonText: translate(store.state.i18n.lang, 'cancel'),
          },
        );
      } catch (e) {
        // cancel
        return;
      }

      const result = await API.deleteRegion(region.value);
      if (result.status === 200) {
        notify({
          title: translate(store.state.i18n.lang, 'success'),
          type: 'success',
          message: translate(store.state.i18n.lang, 'delete_success'),
        });
      } else {
        handleNetworkRequestError(store, result);
      }
    };

    if (preventSSRFetchTwice()) {
      await store.dispatch(ActionTypes.FETCH_REGION_DATA, region.value);
    }

    return {
      title,
      content,
      translate,
      handleSendPost,
      handleDeleteRegion,

      ...toRefs(store.state),
    };
  },
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

.operations {
  margin: 20px 0;
  font-size: 1.2rem;

  i {
    margin-right: 5px;
    cursor: pointer;
  }
}

.post-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  grid-column-gap: 20px;

  .title {
    word-break: break-word;
  }

  i {
    margin-right: 5px;
  }
}

.create {

  .title, .content {
    margin-bottom: 20px;
  }
}

</style>
