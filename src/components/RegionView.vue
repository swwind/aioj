<template>
  <Suspense>
    <div>
      <h1>{{ data.region.title }}</h1>
      <p>{{ data.region.desc }}</p>
      <div class="posts-list">
        <el-alert type="warning" v-if="!data.posts.length">No posts yet</el-alert>
        <div class="post-item" v-for="post of data.posts" :key="post.pid">
          <div class="title"><router-link :to="`/r/${data.region.region}/${post.pid}`">{{ post.title }}</router-link></div>
          <router-link class="author" :to="`/u/${post.author}`"><i class="el-icon-user-solid"></i>{{ post.author }}</router-link>
          <time class="time"><i class="el-icon-date"></i>{{ new Date(post.date).toLocaleString() }}</time>
        </div>
      </div>
    </div>
  </Suspense>
</template>

<script lang="ts">
import { getPostsList } from '@/api/forum';
import { defineComponent, Ref, toRefs } from 'vue';
import { handleNetworkRequestError } from '@/utils';
import { Store, useStore } from 'vuex';
import { MutationTypes, StoreState } from '@/store';
import { RouteLocationNormalizedLoaded } from 'vue-router';

type Props = {
  region: string;
}

export default defineComponent(async (props: Props) => {
  const { region } = toRefs(props);
  const store = useStore<StoreState>();

  const result = await getPostsList(region.value);
  if (result.status === 200) {
    store.commit(MutationTypes.FETCH_REGION_DETAIL, result.region);
    store.commit(MutationTypes.FETCH_POST_LIST, result.posts);
  } else {
    handleNetworkRequestError(store.state.i18n.lang, result);
  }

  return {
    ...toRefs(store.state),
  };
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

</style>
