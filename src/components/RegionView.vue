<template>
  <h1>{{ data.region.title }}</h1>
  <p>{{ data.region.desc }}</p>
  <div class="posts-list">
    <el-alert type="warning" v-if="!data.posts.length">{{ translate(i18n.lang, 'no_posts') }}</el-alert>
    <div class="post-item" v-for="post of data.posts" :key="post.pid">
      <div class="title"><router-link :to="`/r/${data.region.region}/${post.pid}`">{{ post.title }}</router-link></div>
      <router-link class="author" :to="`/u/${post.author}`"><i class="el-icon-user-solid"></i>{{ post.author }}</router-link>
      <time class="time"><i class="el-icon-date"></i>{{ new Date(post.date).toLocaleString() }}</time>
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
        @click="sendPost">
        {{ translate(i18n.lang, 'post') }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { getPostsList, createPost } from '@/api/forum';
import { defineComponent, ref, toRefs } from 'vue';
import { handleNetworkRequestError } from '@/utils';
import { useStore } from 'vuex';
import { MutationTypes, StoreState } from '@/store';
import { translate } from '@/i18n/translate';
import { useRouter } from 'vue-router';

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

    const result = await getPostsList(region.value);
    if (result.status === 200) {
      store.commit(MutationTypes.FETCH_REGION_DETAIL, result.region);
      store.commit(MutationTypes.FETCH_POST_LIST, result.posts);
    } else {
      handleNetworkRequestError(store.state.i18n.lang, result);
    }

    const title = ref('');
    const content = ref('');
    const sendPost = async () => {
      const result = await createPost(region.value, title.value, content.value);
      if (result.status === 200) {
        router.push(`/r/${region.value}/${result.pid}`);
      } else {
        handleNetworkRequestError(store.state.i18n.lang, result);
      }
    }

    return {
      title,
      content,
      translate,
      sendPost,

      ...toRefs(store.state),
    };
  },
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

.post-item {
  display: flex;

  .title {
    flex: 1;
  }

  .time {
    margin-left: 20px;
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
